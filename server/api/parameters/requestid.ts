// API parameter: requestId
// Treat this value as untrusted input.
// Define location, type, required state, limits, allow-lists,
// normalization, and authorization relationship.
// Avoid secrets in URLs and query strings.
export const requestidParameter = {
    name: "requestId",
    location: "query",
    required: false,
    maxLength: 256
};