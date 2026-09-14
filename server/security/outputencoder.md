# Backend Security Responsibility - OutputEncoder

Backend language/framework selected: Framework-specific

Implementation requirement:
Encode output for its actual context and prevent unsafe HTML, SQL, command, or template interpretation.

Security boundary:
The backend is authoritative. Client-side controls must never be used as the only access-control or data-protection mechanism.

Testing:
- Add unit tests for the responsibility.
- Add integration tests at the HTTP/API boundary.
- Add negative tests for rejected or unauthorized requests.