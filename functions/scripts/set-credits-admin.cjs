// Run locally with ADC or an existing Firebase CLI login authorized to manage Firebase Auth.
/* global require, module, process, console */
/* eslint-disable @typescript-eslint/no-require-imports */
const { parseArgs } = require('node:util');

function nextClaims(current, grant) {
  const claims = { ...current };
  if (grant) claims.creditsAdmin = true;
  else delete claims.creditsAdmin;
  return claims;
}

async function main() {
  const { values } = parseArgs({ options: {
    project: { type: 'string' }, uid: { type: 'string' }, email: { type: 'string' },
    grant: { type: 'boolean' }, revoke: { type: 'boolean' }, apply: { type: 'boolean', default: false },
    'firebase-cli': { type: 'boolean', default: false },
  } });
  if (!values.project || Boolean(values.uid) === Boolean(values.email) || Boolean(values.grant) === Boolean(values.revoke)) {
    throw new Error('Usage: node scripts/set-credits-admin.cjs --project PROJECT (--uid UID | --email EMAIL) (--grant | --revoke) [--firebase-cli] [--apply]');
  }
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error('Unset FIREBASE_AUTH_EMULATOR_HOST before changing production roles');
  const { initializeApp, applicationDefault } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  let credential;
  if (values['firebase-cli']) {
    const path = require('node:path');
    const cliPath = process.env.FIREBASE_CLI_PATH || path.dirname(require.resolve('firebase-tools/package.json'));
    const cliAuth = require(path.join(cliPath, 'lib/auth.js'));
    const account = cliAuth.getGlobalDefaultAccount();
    if (!account?.tokens?.refresh_token) throw new Error('Run firebase login first');
    credential = { getAccessToken: async () => {
      const token = await cliAuth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
      return { access_token: token.access_token, expires_in: 3600 };
    } };
  } else credential = applicationDefault();
  const app = initializeApp({ projectId: values.project, credential });
  const auth = getAuth(app);
  const user = values.uid ? await auth.getUser(values.uid) : await auth.getUserByEmail(values.email);
  if (values.grant && user.disabled) throw new Error('Cannot grant a role to a disabled account');
  const claims = nextClaims(user.customClaims, values.grant);
  console.log(JSON.stringify({ project: values.project, uid: user.uid, email: user.email,
    action: values.grant ? 'grant creditsAdmin' : 'revoke creditsAdmin', apply: values.apply }, null, 2));
  if (!values.apply) { console.log('Preview only. Repeat with --apply after checking the account.'); return; }
  await auth.setCustomUserClaims(user.uid, claims);
  const updated = await auth.getUser(user.uid);
  if ((updated.customClaims?.creditsAdmin === true) !== Boolean(values.grant)) throw new Error('Role verification failed');
  console.log('Role saved. Use Refresh access on the admin page, or sign in again.');
}

module.exports = { nextClaims };
if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
