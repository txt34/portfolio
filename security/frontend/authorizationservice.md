# Frontend Security Responsibility - AuthorizationService

This responsibility is integrated at the frontend boundary where appropriate.

Rules:
- The browser is an untrusted environment.
- Never put secrets or authorization decisions in frontend code.
- Treat client validation as usability support, not server authorization.
- Use safe DOM APIs for untrusted output.
- Use HTTPS and secure session mechanisms.