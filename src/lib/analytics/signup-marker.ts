const NEW_SIGNUP_KEY = 'ms_new_signup';

/** Call the instant createUser responds 201 (a real new account, not a self-heal/re-login). */
export function markNewSignup(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(NEW_SIGNUP_KEY, '1');
}

/** Reads and clears the flag — call once, right before the post-login redirect. */
export function consumeNewSignupFlag(): boolean {
  if (typeof window === 'undefined') return false;
  const flag = window.sessionStorage.getItem(NEW_SIGNUP_KEY);
  window.sessionStorage.removeItem(NEW_SIGNUP_KEY);
  return flag === '1';
}
