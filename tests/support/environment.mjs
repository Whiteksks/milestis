// Deterministic public configuration. Tests do not load developer credentials.
Object.assign(process.env, {
  NEXT_PUBLIC_APP_URL: 'https://app.example.test',
  NEXT_PUBLIC_PUBLISHED_SITE_URL: 'https://pages.example.test',
  NEXT_PUBLIC_SUPPORT_EMAIL: 'support@example.test',
  NEXT_PUBLIC_SOCIAL_PROFILES: '',
  NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'demo-project.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'demo-project',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'demo-project.firebasestorage.app',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'test-app-id',
  NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION: 'europe-west4',
  OPENAI_TEXT_MODEL: 'test-text-model',
  OPENAI_IMAGE_MODEL: 'test-image-model',
  POLAR_SERVER: 'sandbox',
})
delete process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN
delete process.env.CORS_EXTRA_ORIGINS
