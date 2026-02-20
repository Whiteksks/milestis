import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { UserDocument } from "./userInterface";

export const createUser = onRequest(
  {
    concurrency: 20,
    timeoutSeconds: 60,
    maxInstances: 10,
  },
  async (req, res) => {
    let uid: string | undefined;

    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "UNAUTHORIZED" });
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      ({ uid } = decodedToken);
      const { email = null, name = null, picture = null } = decodedToken;

      const docRef = db.collection("users").doc(uid);

      const newUser: UserDocument = {
        uid,
        email,
        displayName: name,
        photoURL: picture,
        profileTemplate: {},
        settings: {
          language: "ru",
          notifications: {
            project_updates: true,
            project_reminders: true,
            project_milestones: true,
            whats_new: true,
            personalized_recommendations: false,
            seasonal_specials: false,
          },
        },
        subscription: {
          planId: "free",
          planTier: "free",
          status: "active",
          features: {
            maxProjects: 5,
            maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
            canRemoveBranding: false,
            highQualityExport: false,
            prioritySupport: false,
          },
        },
        balance: {
          total: 0,
          purchased: 0,
          subscription: 0,
          bonus: 0,
        },
        stats: {
          totalProjects: 0,
          projectsPublished: 0,
          projectsInProgress: 0,
          storageUsedBytes: 0,
          totalCreditsSpent: 0,
        },
        metadata: {
          createdAt: FieldValue.serverTimestamp(),
          schemaVersion: 1,
          terms: {
            acceptedVersion: "v1",
            acceptedAt: FieldValue.serverTimestamp(),
          },
        },
      };

      await docRef.create(newUser);

      logger.info("User document created", { uid });
      res.status(201).json({ ok: true, uid });

    } catch (error: any) {
      // Обработка уже существующего документа
      if (error.code === 6 || error.message?.includes("already exists")) {
        logger.warn("User already exists", { uid, code: error.code });
        res.status(409).json({ error: "USER_ALREADY_EXISTS" });
        return;
      }

      // Ошибки Firebase Auth
      if (error.code?.startsWith("auth/")) {
        res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
        return;
      }

      logger.error("Failed to create user", { uid, error });
      res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
);