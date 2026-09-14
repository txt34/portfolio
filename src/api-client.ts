// Central API client.
// Keep requests centralized so authentication, CSRF, validation,
// timeout, and safe error handling can be audited consistently.
export async function apiRequest(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response;
}