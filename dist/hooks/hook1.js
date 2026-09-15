// API hook: hook1
// Stage: BeforeRequest
//
// Appropriate uses: correlation IDs, metrics, safe logging,
// validation orchestration, and consistent error translation.
// Never use hooks to bypass authorization or expose secrets.
export async function hook1Hook(context) {
    return context;
}
