# Setup

Requires Node.js 24 and npm. The Firebase CLI is a dev dependency.

## Local run

```bash
npm ci
npm --prefix functions ci
cp .env.example .env.local
# fill in .env.local
npm run configure
npm run check:config
npm run dev
```

- The app runs at `localhost:3000`.
- Published pages run at `pages.localhost:3000/<slug>` and `<slug>.pages.localhost:3000`.
- The app host and the pages host must be different. `app.example.com` with `pages.example.com` works. `app.pages.example.com` with `pages.example.com` does not.

**Admin SDK credentials.** Use one of:

- ADC: `gcloud auth application-default login`
- `GOOGLE_APPLICATION_CREDENTIALS` set to a service account key stored outside the repo
- `FIREBASE_ADMIN_CLIENT_EMAIL` together with `FIREBASE_ADMIN_PRIVATE_KEY`

**Functions emulator.** Set `NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN=http://127.0.0.1:5001`, run `npm run configure` again, then run `npm --prefix functions run serve`. Auth, Firestore and Storage still use the real project. Leave this variable empty in production.

## Environment

Env files are loaded in this order, highest priority first: process env, `.env.<mode>.local`, `.env.local`, `.env.<mode>`, `.env`. The mode is development by default; pass `--production` to use production. `NEXT_PUBLIC_*` values are inlined at build time.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | App origin, e.g. `https://app.example.com` |
| `NEXT_PUBLIC_PUBLISHED_SITE_URL` | Pages origin, e.g. `https://pages.example.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email |
| `NEXT_PUBLIC_SOCIAL_PROFILES` | Optional comma-separated URLs |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web App config, Functions region, optional emulator origin |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 key for App Check; required on HTTPS |
| `NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN` | Local development only |
| `FIRESTORE_LOCATION` | Firestore location written to `firebase.json` |
| `CORS_EXTRA_ORIGINS` | Extra exact origins, comma-separated |
| `POLAR_SERVER` | `sandbox` or `production` (required) |
| `POLAR_ACCESS_TOKEN` | Server-side Polar token |
| `POLAR_PRODUCT_{CREATOR,ARCHIVE}_{MONTHLY,YEARLY}` | Subscription product IDs |
| `POLAR_CREDITS_PRODUCT_ID` | Credit top-up product (custom amount) |
| `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL` | AI provider key and model names |

`POLAR_WEBHOOK_SECRET` is read only by the `webhookPolar` Function, from Secret Manager.

## Generated files

`npm run configure` writes the following from your env. Add `-- --check` to verify them without writing.

| File | What is generated |
| --- | --- |
| `apphosting.yaml` | Public settings and secret references; never secret values |
| `.firebaserc` | `projects.default` |
| `firebase.json` | `firestore.location` |
| `storage-cors.json` | Allowed origins for the bucket |
| `functions/.env` | Domains, region and origins for Functions |

The committed versions contain placeholders.

## Services

**Firebase**

- Enable Firestore, Storage, App Hosting and Cloud Scheduler.
- Turn on the Google, Email/Password, Email Link and Anonymous sign-in providers.
- Set up App Check with reCAPTCHA v3.
- Enable the Cloud Vision API (used for SafeSearch).
- The Functions service account needs `iam.serviceAccounts.signBlob` for signed guest-upload URLs.

**Polar**

- Create four subscription products: Creator and Archive, each monthly and yearly. Set the metadata `tier` to `creator` or `archive`.
- Create one credits product with a custom amount.
- Point the webhook to `https://REGION-PROJECT_ID.cloudfunctions.net/webhookPolar` and subscribe to the `order.*` and `subscription.*` events.

**Domains.** The app host, the pages host and `*.<pages-host>` must all reach Next.js with the original `Host` header. That requires wildcard DNS and a wildcard TLS certificate.

## Deploy

```bash
npm run configure -- --production
npm run check
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
gcloud storage buckets update gs://BUCKET --cors-file=storage-cors.json
```

Set the App Hosting secrets `polar-access-token` and `openai-api-key`, and the Functions secret `POLAR_WEBHOOK_SECRET`. Then roll out the web app from App Hosting.
