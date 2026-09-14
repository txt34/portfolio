// Filled API endpoint: example-api
// Method: GET
// Route: /api/example
//
// Security pipeline:
// validate -> authenticate -> authorize -> rate limit ->
// parameterized data access -> audit -> safe response.
//
// Treat path/query/header/body values as untrusted.

export interface example-apiRequest {
    // Add typed request parameters here.
}

export async function example-apiHandler(
    request: example-apiRequest
): Promise<unknown> {
    // Implement with the selected backend framework.
    return { ok: true };
}