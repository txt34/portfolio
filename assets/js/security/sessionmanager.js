// Frontend session integration.
// Server-managed sessions should use secure, HttpOnly, SameSite cookies.
export function clearClientSessionState() {
    sessionStorage.removeItem("app-ui-state");
}