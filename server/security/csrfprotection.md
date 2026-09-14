# Backend Security Responsibility - CsrfProtection

Backend language/framework selected: Framework-specific

Implementation requirement:
Validate an anti-CSRF mechanism for state-changing browser requests when cookie-based authentication is used.

Security boundary:
The backend is authoritative. Client-side controls must never be used as the only access-control or data-protection mechanism.

Testing:
- Add unit tests for the responsibility.
- Add integration tests at the HTTP/API boundary.
- Add negative tests for rejected or unauthorized requests.