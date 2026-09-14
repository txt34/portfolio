# OWASP Top 10 - 8 - Software and Data Integrity Failures

## Security objective

Protect application code, data, updates, and security-critical workflows from unauthorized modification.

## Website implementation requirements

- Use integrity verification for security-sensitive artifacts where appropriate.
- Protect deployment credentials and CI/CD configuration.
- Review build and package provenance.
- Do not execute untrusted uploaded content as code.
- Test update and deployment paths for unauthorized modification.

## Security classes integrated

- SecretProvider
- AuditLogger

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.