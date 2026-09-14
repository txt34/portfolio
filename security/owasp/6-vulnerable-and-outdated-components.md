# OWASP Top 10 - 6 - Vulnerable and Outdated Components

## Security objective

Keep dependencies and generated components maintained and trustworthy.

## Website implementation requirements

- Pin or constrain dependency versions appropriately.
- Review dependency advisories and remove unnecessary packages.
- Use trusted package sources and integrity verification.
- Track dependency ownership and update procedures.
- Test security-sensitive upgrades before production.

## Security classes integrated

- AuditLogger

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.