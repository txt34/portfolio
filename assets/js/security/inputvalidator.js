// Frontend security implementation: InputValidator
// Purpose: improve UX and reject obviously malformed input before a request.
// IMPORTANT: server-side validation is mandatory.
export function validate(value, rules = {}) {
    const text = String(value ?? "");
    if (rules.required && text.trim().length === 0) return { valid: false, reason: "required" };
    if (rules.maxLength && text.length > rules.maxLength) return { valid: false, reason: "maxLength" };
    if (rules.pattern && !(new RegExp(rules.pattern).test(text))) return { valid: false, reason: "pattern" };
    return { valid: true, value: text };
}