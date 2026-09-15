// API hook: Request Security Hook
// Stage: BeforeRequest
//
// Appropriate uses: correlation IDs, metrics, safe logging,
// validation orchestration, and consistent error translation.
// Never use hooks to bypass authorization or expose secrets.
export async function requestSecurityHook(context) {
    if (!context || typeof context !== "object" || Array.isArray(context)) {
        return context;
    }
    const blockedKeys = new Set([
        "authorization",
        "cookie",
        "password",
        "passwordHash",
        "secret",
        "session",
        "token",
        "body"
    ]);
    return Object.fromEntries(Object.entries(context).filter(([key]) => !blockedKeys.has(key.toLowerCase())));
}
