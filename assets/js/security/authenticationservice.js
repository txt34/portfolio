// Frontend authentication state.
// Never treat client state as proof of authentication.
export function isAuthenticated(sessionState) {
    return Boolean(sessionState?.authenticated);
}