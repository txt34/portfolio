// Frontend integration: SecureApiClient
// Centralize requests so security behavior is not duplicated across pages.
export async function secureRequest(url, options = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options
    });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response;
}