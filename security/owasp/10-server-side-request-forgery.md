# OWASP Top 10 - 10 - Server-Side Request Forgery

## Security objective

Prevent the server from being abused as a proxy to unintended destinations.

## Website implementation requirements

- Do not fetch arbitrary URLs supplied directly by users.
- Use strict allow-lists for permitted upstream destinations.
- Validate scheme, host, port, and redirect behavior.
- Block access to internal/private destinations when the application does not require it.
- Apply outbound network controls and request timeouts.

## Security classes integrated

- RequestValidator
- InputValidator
- AuditLogger

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.