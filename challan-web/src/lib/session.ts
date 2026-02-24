const COOKIE_NAME = "auth_session";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setSessionCookie(): void {
  if (typeof document === "undefined") return;

  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";

  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;

  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
}
