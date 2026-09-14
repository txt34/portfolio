# OWASP Top 10 - 3 - Injection

## Security objective

Prevent untrusted data from being interpreted as executable commands or queries.

## Website implementation requirements

- Use parameterized database queries or framework query builders.
- Use context-appropriate output encoding and safe DOM APIs.
- Allow-list structured input where practical.
- Never construct shell commands from raw request data.
- Validate input at the server boundary before business logic.

## Security classes integrated

- InputValidator
- RequestValidator
- OutputEncoder

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.