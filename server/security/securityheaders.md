# Backend Security Responsibility - SecurityHeaders

Backend language/framework selected: Framework-specific

Implementation requirement:
Set appropriate HTTP security headers at the server/reverse-proxy layer.

Security boundary:
The backend is authoritative. Client-side controls must never be used as the only access-control or data-protection mechanism.

Testing:
- Add unit tests for the responsibility.
- Add integration tests at the HTTP/API boundary.
- Add negative tests for rejected or unauthorized requests.