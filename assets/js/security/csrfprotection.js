// Frontend integration: CsrfProtection
// The server must issue and validate the token.
export function withCsrf(headers, token) {
    const next = new Headers(headers || {});
    if (token) next.set("X-CSRF-Token", token);
    return next;
}