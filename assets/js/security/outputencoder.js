// Frontend security implementation: OutputEncoder
// Prefer textContent and DOM APIs that do not interpret untrusted strings as HTML.
export function setSafeText(element, value) {
    if (!element) return;
    element.textContent = String(value ?? "");
}