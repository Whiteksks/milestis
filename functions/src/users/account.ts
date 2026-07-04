import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import type { Request, Response } from "express";
import { db } from "../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from "../projects/publish/slug";
import {
  mapAuthPayload,
  mapUserDocument,
  mapTransaction,
  mapCreditLot,
  mapProjectDocument,
  mapPublishedSnapshotWithContent,
  mapImageMetadata,
  mapExportRecord,
} from "./exportSchemas";

const ERROR = {
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  NOT_FOUND: "NOT_FOUND",
  ACTIVE_SUBSCRIPTION: "ACTIVE_SUBSCRIPTION",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

const USER_FUNCTION_OPTIONS = {
  concurrency: 10,
  timeoutSeconds: 540,
  memory: "512MiB" as const,
  maxInstances: 10,
  cors: ALLOWED_ORIGINS,
};

const DELETE_BATCH_SIZE = 400;

function sendJsonDownload(res: Response, filename: string, payload: unknown): void {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.status(200).send(JSON.stringify(payload, null, 2));
}

function rejectNonPost(req: Request, res: Response): boolean {
  if (req.method === "POST") return false;
  res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
  return true;
}

async function authenticateRequest(req: Request, res: Response): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: ERROR.UNAUTHORIZED });
    return null;
  }

  try {
    const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
    return decoded.uid;
  } catch {
    res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
    return null;
  }
}

async function deleteStoragePrefix(prefix: string, logPrefix: string): Promise<void> {
  try {
    await getStorage().bucket().deleteFiles({ prefix });
  } catch (err) {
    logger.warn(`${logPrefix} Failed to delete Storage prefix ${prefix}.`, err);
  }
}

async function deleteSnapshotsInBatches(
  docs: FirebaseFirestore.QueryDocumentSnapshot[],
): Promise<void> {
  for (let index = 0; index < docs.length; index += DELETE_BATCH_SIZE) {
    const batch = db.batch();
    for (const doc of docs.slice(index, index + DELETE_BATCH_SIZE)) {
      batch.delete(doc.ref);
    }
    await batch.commit();
  }
}

async function deleteCollectionTree(
  collectionRef: FirebaseFirestore.CollectionReference,
): Promise<number> {
  let deletedCount = 0;

  while (true) {
    const snapshot = await collectionRef.limit(100).get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      deletedCount += await deleteDocumentTree(doc.ref);
    }
  }

  return deletedCount;
}

async function deleteDocumentTree(
  docRef: FirebaseFirestore.DocumentReference,
): Promise<number> {
  const subcollections = await docRef.listCollections();
  let deletedCount = 0;

  for (const subcollection of subcollections) {
    deletedCount += await deleteCollectionTree(subcollection);
  }

  await docRef.delete();
  return deletedCount + 1;
}

async function deleteProjectArtifacts(
  uid: string,
  projectRef: FirebaseFirestore.DocumentReference,
): Promise<{
  imagesDeleted: number;
  projectSubdocsDeleted: number;
  publishedSnapshotsDeleted: number;
  slugReservationsDeleted: number;
}> {
  const projectId = projectRef.id;

  const imagesSnap = await db.collection("images").where("projectId", "==", projectId).get();
  if (!imagesSnap.empty) {
    await deleteSnapshotsInBatches(imagesSnap.docs);
  }

  let projectSubdocsDeleted = 0;
  const projectSubcollections = await projectRef.listCollections();
  for (const subcollection of projectSubcollections) {
    projectSubdocsDeleted += await deleteCollectionTree(subcollection);
  }

  const publishedRef = db.collection("published_projects").doc(projectId);
  const publishedSnap = await publishedRef.get();
  if (publishedSnap.exists) {
    await publishedRef.delete();
  }

  const slugReservations = await db
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .where("projectId", "==", projectId)
    .get();
  if (!slugReservations.empty) {
    await deleteSnapshotsInBatches(slugReservations.docs);
  }

  await deleteStoragePrefix(`public/${projectId}/`, `[deleteUserAccount:${uid}]`);

  return {
    imagesDeleted: imagesSnap.size,
    projectSubdocsDeleted,
    publishedSnapshotsDeleted: publishedSnap.exists ? 1 : 0,
    slugReservationsDeleted: slugReservations.size,
  };
}

function hasBlockingSubscription(subData: Record<string, unknown> | undefined): boolean {
  const status = typeof subData?.status === "string" ? subData.status : null;
  const planTier = typeof subData?.planTier === "string" ? subData.planTier : null;
  const cancelAtPeriodEnd = subData?.cancelAtPeriodEnd === true;
  return Boolean(
    subData?.polarSubscriptionId &&
    !cancelAtPeriodEnd &&
    (planTier === "creator" || planTier === "archive") &&
    (status === "active" || status === "trialing" || status === "past_due" || status === "paused"),
  );
}

export const exportUserData = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  try {
    const userRef = db.collection("users").doc(uid);
    const [authUser, userSnap, creditLotsSnap, transactionsSnap] = await Promise.all([
      getAuth().getUser(uid),
      userRef.get(),
      userRef.collection("creditLots").get(),
      db.collection("transactions").where("uid", "==", uid).get(),
    ]);

    if (!userSnap.exists) {
      res.status(404).json({ error: ERROR.NOT_FOUND, message: "User document not found." });
      return;
    }

    const payload = {
      kind: "user-data-export",
      exportedAt: new Date().toISOString(),
      uid,
      auth: mapAuthPayload(authUser),
      user: mapUserDocument(userSnap),
      creditLots: creditLotsSnap.docs.map(mapCreditLot),
      transactions: transactionsSnap.docs.map(mapTransaction),
      summary: {
        creditLots: creditLotsSnap.size,
        transactions: transactionsSnap.size,
      },
    };

    sendJsonDownload(res, `milestis-user-data-${uid}.json`, payload);
  } catch (err) {
    logger.error(`[exportUserData] Failed for ${uid}:`, err);
    res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
  }
});

export const deleteUserAccount = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  try {
    const userRef = db.collection("users").doc(uid);

    const userSnap = await userRef.get();
    const subData = userSnap.data()?.subscription as Record<string, unknown> | undefined;
    if (hasBlockingSubscription(subData)) {
      res.status(409).json({
        error: ERROR.ACTIVE_SUBSCRIPTION,
        message: "Cancel your active subscription before deleting the account.",
      });
      return;
    }

    const projectsSnap = await db.collection("projects").where("ownerId", "==", uid).get();

    let imagesDeleted = 0;
    let projectSubdocsDeleted = 0;
    let publishedSnapshotsDeleted = 0;
    let slugReservationsDeleted = 0;

    for (const projectDoc of projectsSnap.docs) {
      const summary = await deleteProjectArtifacts(uid, projectDoc.ref);
      imagesDeleted += summary.imagesDeleted;
      projectSubdocsDeleted += summary.projectSubdocsDeleted;
      publishedSnapshotsDeleted += summary.publishedSnapshotsDeleted;
      slugReservationsDeleted += summary.slugReservationsDeleted;
      await projectDoc.ref.delete();
    }

    const [quotesSnap, transactionsSnap, idemSnap] = await Promise.all([
      db.collection("publish_quotes").where("uid", "==", uid).get(),
      db.collection("transactions").where("uid", "==", uid).get(),
      db.collection("transactionIdempotency").where("uid", "==", uid).get(),
    ]);

    for (const snapshot of [quotesSnap, transactionsSnap, idemSnap]) {
      if (snapshot.empty) continue;
      await deleteSnapshotsInBatches(snapshot.docs);
    }

    const userSubcollections = await userRef.listCollections();
    let userSubdocsDeleted = 0;
    for (const subcollection of userSubcollections) {
      userSubdocsDeleted += await deleteCollectionTree(subcollection);
    }

    await Promise.all([
      deleteStoragePrefix(`users/${uid}/`, `[deleteUserAccount:${uid}]`),
      deleteStoragePrefix(`exports/${uid}/`, `[deleteUserAccount:${uid}]`),
      deleteStoragePrefix(`avatars/${uid}/`, `[deleteUserAccount:${uid}]`),
    ]);

    const userSnap2 = await userRef.get();
    if (userSnap2.exists) {
      await userRef.delete();
    }

    await getAuth().deleteUser(uid);

    logger.info(`[deleteUserAccount] Deleted account ${uid}.`, {
      projectsDeleted: projectsSnap.size,
      imagesDeleted,
      projectSubdocsDeleted,
      publishedSnapshotsDeleted,
      slugReservationsDeleted,
      publishQuotesDeleted: quotesSnap.size,
      transactionsDeleted: transactionsSnap.size,
      transactionIdempotencyDeleted: idemSnap.size,
      userSubdocsDeleted,
    });

    res.status(200).json({
      ok: true,
      uid,
      deleted: {
        projects: projectsSnap.size,
        images: imagesDeleted,
        projectSubdocs: projectSubdocsDeleted,
        publishedSnapshots: publishedSnapshotsDeleted,
        slugReservations: slugReservationsDeleted,
        publishQuotes: quotesSnap.size,
        transactions: transactionsSnap.size,
        transactionIdempotency: idemSnap.size,
        userSubdocs: userSubdocsDeleted,
      },
    });
  } catch (err) {
    logger.error(`[deleteUserAccount] Failed for ${uid}:`, err);
    res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
  }
});

export const exportProjectContent = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  const { projectId } = req.body as { projectId?: string };
  if (!projectId || typeof projectId !== "string") {
    res.status(400).json({ error: "INVALID_ARGUMENT", message: "projectId is required." });
    return;
  }

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const [projectSnap, publishedSnap, exportsSnap, imagesSnap] = await Promise.all([
      projectRef.get(),
      db.collection("published_projects").doc(projectId).get(),
      projectRef.collection("exports").get(),
      db.collection("images").where("projectId", "==", projectId).get(),
    ]);

    if (!projectSnap.exists) {
      res.status(404).json({ error: ERROR.NOT_FOUND, message: "Project not found." });
      return;
    }

    const projectData = projectSnap.data() as Record<string, unknown>;
    if (projectData.ownerId !== uid) {
      res.status(403).json({ error: ERROR.UNAUTHORIZED, message: "Access denied." });
      return;
    }

    const payload = {
      kind: "project-content-export",
      exportedAt: new Date().toISOString(),
      uid,
      projectId,
      project: mapProjectDocument(projectSnap as FirebaseFirestore.QueryDocumentSnapshot),
      publishedContent: publishedSnap.exists
        ? mapPublishedSnapshotWithContent(publishedSnap as FirebaseFirestore.QueryDocumentSnapshot)
        : null,
      exportRecords: exportsSnap.docs.map(mapExportRecord),
      imageMetadata: imagesSnap.docs.map(mapImageMetadata),
    };

    const safeName = (projectData.name as string ?? projectId)
      .replace(/[^a-z0-9_-]/gi, "-")
      .toLowerCase()
      .slice(0, 40);
    sendJsonDownload(res, `milestis-project-${safeName}.json`, payload);
  } catch (err) {
    logger.error(`[exportProjectContent] Failed for ${uid}/${projectId}:`, err);
    res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
  }
});