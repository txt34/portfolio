# Backend Security Responsibility - SecretProvider

Backend language/framework selected: Framework-specific

Implementation requirement:
Load secrets from environment/secret-management infrastructure; never hard-code credentials.

Security boundary:
The backend is authoritative. Client-side controls must never be used as the only access-control or data-protection mechanism.

Testing:
- Add unit tests for the responsibility.
- Add integration tests at the HTTP/API boundary.
- Add negative tests for rejected or unauthorized requests.