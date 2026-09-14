// Frontend error boundary helper.
// Do not display server stack traces or secrets to users.
export function presentSafeError(message = "An unexpected error occurred.") {
    return String(message).slice(0, 300);
}