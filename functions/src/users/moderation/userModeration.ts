import { Timestamp } from "firebase-admin/firestore";

export interface UserModeration {
  banned: boolean;
  reason: string | null;
  bannedAt: Timestamp | null;
}