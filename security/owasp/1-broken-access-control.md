# OWASP Top 10 - 1 - Broken Access Control

## Security objective

Deny by default and enforce server-side authorization for every protected resource and action.

## Website implementation requirements

- Authenticate the request before protected operations.
- Authorize the requested action against the authenticated identity and resource.
- Use centralized policies and least privilege.
- Do not rely on hidden UI controls, client-side checks, or URL obscurity.
- Return an appropriate denial response without leaking resource existence unnecessarily.

## Security classes integrated

- AuthorizationService
- AccessPolicy

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.