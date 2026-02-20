export interface UserProfileTemplate {
  name?: string;
  location?: string;
  bio?: string;
  sociallinks?: {
    link1?: string;
    link2?: string;
    link3?: string;
    link4?: string;
  }
}

export interface UserSettings {
  language: "ru" | "en" | "kz";
  notifications: {
    project_updates: boolean;
    project_reminders: boolean;
    project_milestones: boolean;
    whats_new: boolean;
    personalized_recommendations: boolean;
    seasonal_specials: boolean;
  };
};

export interface UserDocument {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  profileTemplate: UserProfileTemplate;
  settings: UserSettings; 
}