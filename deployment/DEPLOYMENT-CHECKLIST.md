# Deployment Checklist

- [ ] Production configuration selected
- [ ] Secrets stored outside source code
- [ ] HTTPS/TLS configured
- [ ] Security headers reviewed
- [ ] Authentication and authorization tested
- [ ] Rate limits reviewed
- [ ] Error messages do not disclose sensitive details
- [ ] Dependencies reviewed
- [ ] Database backups/restore procedure verified
- [ ] Health check verified
- [ ] Rollback procedure documented
- [ ] `npm ci --ignore-scripts`, `npm run build`, and `npm test` pass in CI
- [ ] Production session store is external to the process (not Express MemoryStore)
- [ ] Request and header timeouts are configured for the deployment proxy
- [ ] Diagnostic stream subscriber capacity and shutdown behavior are verified
- [ ] Shared Redis-backed session and rate-limit stores configured for multiple replicas
- [ ] Load balancer readiness checks `/healthz` before sending traffic
- [ ] Product media served through approved object storage/CDN origins