# Parameter Protection

Defensive parameter-handling baseline.

- Validate type, length, format, and allowed values server-side.
- Canonicalize input before security decisions.
- Use allow-lists for structured parameters.
- Avoid placing secrets in URLs, HTML, JavaScript, or logs.
- Prefer opaque identifiers where exposing sequential identifiers is unnecessary.
- Use HTTPS for transport protection.
- Use authenticated, integrity-protected tokens where tokens are required.
- Do not use obfuscation or "cloaking" as a substitute for access control.

Client-side encoding is not a security boundary. Sensitive data must be protected on the server.