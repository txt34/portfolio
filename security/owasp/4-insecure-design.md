# OWASP Top 10 - 4 - Insecure Design

## Security objective

Build security requirements into the application's architecture and workflow.

## Website implementation requirements

- Define trust boundaries and protected assets.
- Use secure defaults and fail closed.
- Centralize authorization and validation.
- Threat-model sensitive workflows before deployment.
- Add negative tests for abuse and unauthorized behavior.

## Security classes integrated

- AccessPolicy
- AuthorizationService
- RequestValidator

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.