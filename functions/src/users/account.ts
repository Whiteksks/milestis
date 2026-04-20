import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import type { Request, Response } from "express";
import { db } from "../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from "../projects/publish/slug";

const ERROR = {
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  NOT_FOUND: "NOT_FOUND",
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

function withDocId(snapshot: FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot) {
  return { id: snapshot.id, ...(snapshot.data() ?? {}) };
}

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

export const exportUserData = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  try {
    const userRef = db.collection("users").doc(uid);
    const [authUser, userSnap, privateSnap, creditLotsSnap, transactionsSnap, idemSnap] = await Promise.all([
      getAuth().getUser(uid),
      userRef.get(),
      userRef.collection("private").doc("data").get(),
      userRef.collection("creditLots").get(),
      db.collection("transactions").where("uid", "==", uid).get(),
      db.collection("transactionIdempotency").where("uid", "==", uid).get(),
    ]);

    if (!userSnap.exists) {
      res.status(404).json({ error: ERROR.NOT_FOUND, message: "User document not found." });
      return;
    }

    const payload = {
      kind: "user-data-export",
      exportedAt: new Date().toISOString(),
      uid,
      auth: {
        uid: authUser.uid,
        email: authUser.email ?? null,
        emailVerified: authUser.emailVerified,
        displayName: authUser.displayName ?? null,
        photoURL: authUser.photoURL ?? null,
        disabled: authUser.disabled,
        phoneNumber: authUser.phoneNumber ?? null,
        providerData: authUser.providerData,
        metadata: authUser.metadata,
      },
      user: withDocId(userSnap),
      privateData: privateSnap.exists ? withDocId(privateSnap) : null,
      moderation: userSnap.data()?.moderation ?? null,
      creditLots: creditLotsSnap.docs.map(withDocId),
      transactions: transactionsSnap.docs.map(withDocId),
      transactionIdempotency: idemSnap.docs.map(withDocId),
      summary: {
        creditLots: creditLotsSnap.size,
        transactions: transactionsSnap.size,
        idempotencyKeys: idemSnap.size,
      },
    };

    sendJsonDownload(res, `milestis-user-data-${uid}.json`, payload);
  } catch (err) {
    logger.error(`[exportUserData] Failed for ${uid}:`, err);
    res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
  }
});

export const exportProjectMetadata = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  try {
    const [projectsSnap, imagesSnap, publishedSnap] = await Promise.all([
      db.collection("projects").where("ownerId", "==", uid).get(),
      db.collection("images").where("ownerId", "==", uid).get(),
      db.collection("published_projects").where("ownerId", "==", uid).get(),
    ]);

    const projectBundles = await Promise.all(
      projectsSnap.docs.map(async (projectDoc) => {
        const projectId = projectDoc.id;
        const exportsSnap = await projectDoc.ref.collection("exports").get();
        const projectImages = imagesSnap.docs
          .filter((imageDoc) => imageDoc.data().projectId === projectId)
          .map(withDocId);
        const publishedProject = publishedSnap.docs.find((doc) => doc.id === projectId);

        return {
          project: withDocId(projectDoc),
          exportRecords: exportsSnap.docs.map(withDocId),
          imageMetadata: projectImages,
          publishedSnapshot: publishedProject ? withDocId(publishedProject) : null,
        };
      }),
    );

    const payload = {
      kind: "project-metadata-export",
      exportedAt: new Date().toISOString(),
      uid,
      projects: projectBundles,
      summary: {
        projects: projectsSnap.size,
        images: imagesSnap.size,
        publishedProjects: publishedSnap.size,
        exportRecords: projectBundles.reduce((total, project) => total + project.exportRecords.length, 0),
      },
    };

    sendJsonDownload(res, `milestis-project-metadata-${uid}.json`, payload);
  } catch (err) {
    logger.error(`[exportProjectMetadata] Failed for ${uid}:`, err);
    res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
  }
});

export const deleteUserAccount = onRequest(USER_FUNCTION_OPTIONS, async (req, res) => {
  if (rejectNonPost(req, res)) return;

  const uid = await authenticateRequest(req, res);
  if (!uid) return;

  try {
    const userRef = db.collection("users").doc(uid);
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

    const userSnap = await userRef.get();
    if (userSnap.exists) {
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