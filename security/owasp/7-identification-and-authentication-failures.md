# OWASP Top 10 - 7 - Identification and Authentication Failures

## Security objective

Protect identity, credentials, and authentication workflows.

## Website implementation requirements

- Use established password-hashing and authentication primitives.
- Use secure session identifiers and appropriate expiration.
- Protect authentication endpoints with rate limiting and abuse controls.
- Do not log passwords, session tokens, or authentication secrets.
- Require authorization checks after authentication.

## Security classes integrated

- AuthenticationService
- SessionManager
- RateLimiter
- AuthorizationService

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.