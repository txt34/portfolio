# OWASP Top 10 - 2 - Cryptographic Failures

## Security objective

Protect sensitive information throughout storage, processing, and transport.

## Website implementation requirements

- Use HTTPS/TLS for application traffic.
- Do not hard-code credentials, API keys, or encryption keys.
- Use established cryptographic libraries and authenticated encryption where encryption is required.
- Minimize collection and retention of sensitive data.
- Protect secrets with environment/secret-management infrastructure.

## Security classes integrated

- SecretProvider
- SessionManager

## Frontend rule

Frontend controls may improve user experience and reduce malformed requests, but the browser is not a trusted security boundary. Authorization, sensitive validation, and secret protection must be enforced server-side.

## Verification

Create automated unit and integration tests for the selected control. Review the implementation against the actual frontend framework, backend framework, dependencies, deployment environment, and threat model before production.