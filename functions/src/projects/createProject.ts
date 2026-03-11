import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import {
  CreateProjectPayload,
  ProjectMetadata,
  ProjectMode,
  VALID_MODES,
  PROJECT_NAME_MIN_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
} from "./projectInterface";

// ─── Error codes ──────────────────────────────────────────────────────────

const ERROR = {
  METHOD_NOT_ALLOWED:      "METHOD_NOT_ALLOWED",
  UNAUTHORIZED:            "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN:"INVALID_OR_EXPIRED_TOKEN",
  INVALID_PAYLOAD:         "INVALID_PAYLOAD",
  PROJECT_LIMIT_REACHED:   "PROJECT_LIMIT_REACHED",
  INTERNAL_SERVER_ERROR:   "INTERNAL_SERVER_ERROR",
} as const;

// ─── Validation ───────────────────────────────────────────────────────────

function validatePayload(body: unknown): CreateProjectPayload {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body must be a JSON object.");
  }

  const { mode, name, template } = body as Record<string, unknown>;

  if (typeof name !== "string") {
    throw new ValidationError("Field 'name' must be a string.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length < PROJECT_NAME_MIN_LENGTH) {
    throw new ValidationError("Project name must not be empty.");
  }

  if (trimmedName.length > PROJECT_NAME_MAX_LENGTH) {
    throw new ValidationError(
      `Project name must be at most ${PROJECT_NAME_MAX_LENGTH} characters.`
    );
  }

  if (/[\x00-\x1F\x7F]/.test(trimmedName)) {
    throw new ValidationError("Project name contains invalid characters.");
  }

  if (typeof mode !== "string" || !VALID_MODES.includes(mode as ProjectMode)) {
    throw new ValidationError(
      `Field 'mode' must be one of: ${VALID_MODES.join(", ")}.`
    );
  }

  let validatedTemplate: { id: string } | undefined;
  if (template !== undefined) {
    const t = template as Record<string, unknown>;
    if (typeof template !== "object" || template === null || typeof t.id !== "string") {
      throw new ValidationError("Field 'template' must have string 'id'.");
    }
    validatedTemplate = { id: t.id };
  }

  return { mode: mode as CreateProjectPayload["mode"], name: trimmedName, template: validatedTemplate };
}

class ValidationError extends Error {}
class UserNotFoundError extends Error {}
class LimitError extends Error {
  constructor(public readonly maxProjects: number) {
    super(`Your plan allows up to ${maxProjects} projects.`);
  }
}

// ─── Document builder ─────────────────────────────────────────────────────

function buildProjectDocument(
  id: string,
  ownerId: string,
  payload: CreateProjectPayload
): ProjectMetadata {
  const doc: ProjectMetadata = {
    id,
    ownerId,
    name: payload.name,
    mode: payload.mode,
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    schemaVersion: 1,
  };
  if (payload.template) {
    doc.template = payload.template;
  }
  return doc;
}

// ─── Cloud Function ───────────────────────────────────────────────────────

export const createProject = onRequest(
  {
    concurrency: 20,
    timeoutSeconds: 60,
    maxInstances: 10,
    cors: [/localhost/, /milestis\.app$/],
  },
  async (req, res) => {
    let uid: string | undefined;

    // ── Method guard ────────────────────────────────────────────────────
    if (req.method !== "POST") {
      res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
      return;
    }

    // ── Auth ────────────────────────────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: ERROR.UNAUTHORIZED });
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch {
      res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
      return;
    }

    // ── Payload validation ──────────────────────────────────────────────
    let payload: CreateProjectPayload;
    try {
      payload = validatePayload(req.body);
    } catch (err) {
      const message = err instanceof ValidationError ? err.message : "Invalid payload.";
      res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message });
      return;
    }

    // ── Business logic ──────────────────────────────────────────────────
    try {
      const userRef = db.collection("users").doc(uid);
      const projectRef = db
        .collection("projects")
        .doc(); // auto-generated ID

      await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);

        if (!userSnap.exists) {
          throw new UserNotFoundError();
        }

        const userData = userSnap.data()!;
        const maxProjects: number = userData.subscription?.features?.maxProjects ?? 5;
        const totalProjects: number = userData.stats?.totalProjects ?? 0;

        if (totalProjects >= maxProjects) {
          throw new LimitError(maxProjects);
        }

        const projectDoc = buildProjectDocument(projectRef.id, uid!, payload);

        tx.create(projectRef, projectDoc);
        tx.update(userRef, {
          "stats.totalProjects": FieldValue.increment(1),
          "stats.projectsInProgress": FieldValue.increment(1),
        });
      });

      logger.info("Project created", { uid, projectId: projectRef.id, mode: payload.mode });
      res.status(201).json({ ok: true, projectId: projectRef.id });
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        res.status(401).json({ error: ERROR.UNAUTHORIZED });
        return;
      }
      if (err instanceof LimitError) {
        res.status(403).json({ error: ERROR.PROJECT_LIMIT_REACHED, message: err.message });
        return;
      }
      logger.error("Failed to create project", { uid, err });
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
