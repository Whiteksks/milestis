import { randomUUID } from "crypto";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { getSlugReservationDocId, getSlugValidationError, isSlugBlocked, normalizeSlug, PUBLISHED_PROJECT_SLUGS_COLLECTION } from "../publish/slug/index";
import { MenuPublishError, prepareMenuSnapshot } from "./snapshot";

export interface MenuPublishInput { projectId: string; slug: string; locale: "ru" | "en" | "kz" }
export function validateMenuPublishInput(body: unknown): MenuPublishInput {
  const input = body as Partial<MenuPublishInput> | null;
  if (!input || typeof input.projectId !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(input.projectId) || typeof input.slug !== "string") throw new MenuPublishError("INVALID_PAYLOAD");
  const slug = normalizeSlug(input.slug);
  if (getSlugValidationError(slug) || isSlugBlocked(slug)) throw new MenuPublishError("INVALID_SLUG");
  if (!input.locale || !["ru", "en", "kz"].includes(input.locale)) throw new MenuPublishError("INVALID_PAYLOAD");
  return { projectId: input.projectId, slug, locale: input.locale };
}

export async function publishMenuSnapshot(
  db: Firestore, uid: string, input: MenuPublishInput,
  copyMedia: <T>(snapshot: T, uid: string, projectId: string) => Promise<T>,
) {
  const { projectId, slug, locale } = input;
  const projectRef = db.collection("projects").doc(projectId);
  const draftRef = projectRef.collection("data").doc("content");
  const publicRef = db.collection("published_projects").doc(projectId);
  const slugRef = db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION).doc(getSlugReservationDocId("menu", slug));
  const attemptId = randomUUID();
  const assertProject = (project: FirebaseFirestore.DocumentData | undefined) => {
    if (!project) throw new MenuPublishError("NOT_FOUND", 404);
    if (project.ownerId !== uid) throw new MenuPublishError("FORBIDDEN", 403);
    if (project.mode !== "menu" || project.status !== "active") throw new MenuPublishError("NOT_PUBLISHABLE", 409);
    if (project.publishedSlug && project.publishedSlug !== slug) throw new MenuPublishError("SLUG_IMMUTABLE", 409);
  };
  const draft = await db.runTransaction(async (tx) => {
    const [projectSnap, draftSnap, slugSnap] = await tx.getAll(projectRef, draftRef, slugRef);
    const project = projectSnap.data();
    assertProject(project);
    if (project!.publishLockExpiresAtMillis > Date.now()) throw new MenuPublishError("PUBLISH_IN_PROGRESS", 409);
    if (slugSnap.exists && slugSnap.data()?.projectId !== projectId) throw new MenuPublishError("SLUG_TAKEN", 409);
    const snapshot = prepareMenuSnapshot(draftSnap.data());
    tx.update(projectRef, { publishLockId: attemptId, publishLockExpiresAtMillis: Date.now() + 10 * 60_000 });
    return { snapshot, updateTime: draftSnap.updateTime! };
  });
  let committed = false;
  try {
    const snapshot = await copyMedia(draft.snapshot, uid, projectId);
    await db.runTransaction(async (tx) => {
      const [projectSnap, draftSnap, slugSnap] = await tx.getAll(projectRef, draftRef, slugRef);
      const project = projectSnap.data();
      assertProject(project);
      if (project!.publishLockId !== attemptId) throw new MenuPublishError("PUBLISH_CANCELLED", 409);
      if (!draftSnap.updateTime?.isEqual(draft.updateTime)) throw new MenuPublishError("DRAFT_CHANGED", 409);
      if (slugSnap.exists && slugSnap.data()?.projectId !== projectId) throw new MenuPublishError("SLUG_TAKEN", 409);
      const version = (project!.publishVersion ?? 0) + 1;
      tx.set(slugRef, { projectId, ownerId: uid, mode: "menu", slug, updatedAt: FieldValue.serverTimestamp() });
      tx.set(publicRef, { ...snapshot, ownerId: uid, name: snapshot.content.sectionContent.venue.name, mode: "menu", slug, locale, isPublished: true, publishVersion: version, publishedAt: FieldValue.serverTimestamp() });
      tx.update(projectRef, { isPublished: true, publishedSlug: slug, publishVersion: version, publishedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), publishLockId: FieldValue.delete(), publishLockExpiresAtMillis: FieldValue.delete() });
      if (!project!.publishedSlug) tx.update(db.collection("users").doc(uid), { "stats.projectsPublished": FieldValue.increment(1) });
    });
    committed = true;
    return { ok: true as const, publishedSlug: slug };
  } finally {
    // Unpublish cancels the lease; never clear a newer worker's lease.
    if (!committed) await db.runTransaction(async (tx) => {
      const project = await tx.get(projectRef);
      if (project.data()?.publishLockId === attemptId) tx.update(projectRef, { publishLockId: FieldValue.delete(), publishLockExpiresAtMillis: FieldValue.delete() });
    }).catch((error) => {
      // Keep the original failure; a failed cleanup lease expires automatically.
      console.warn("[publishMenu] Could not release publication lease", error);
    });
  }
}
