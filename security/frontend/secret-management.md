# Frontend Security Module - Secret management

Implement this control in the frontend layer without treating the browser as a trusted security boundary.

- Keep secrets out of HTML, JavaScript bundles, source maps, and local storage.
- Validate user input for usability, then validate it again on the server.
- Use safe DOM APIs for untrusted content.
- Use HTTPS and secure session mechanisms.
- Never rely on hidden fields, disabled buttons, or client-side checks for authorization.