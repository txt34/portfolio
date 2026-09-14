# OWASP Top 10 - 9 - Security Logging and Monitoring Failures

## Security objective

Make security events useful for detection, investigation, and response.

## Website implementation requirements

- Record authentication, authorization, validation, and other important security events.
- Do not log passwords, access tokens, or unnecessary sensitive data.
- Use timestamps and request/correlation identifiers where appropriate.
- Protect logs from unauthorized modification.
- Monitor alerts and establish a response procedure.

## Security classes integrated

- AuditLogger
- ErrorHandler

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.