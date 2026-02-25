# Security Rules

## Authentication & Authorization
- JWT tokens stored in memory/httpOnly cookies only
- Validate tokens on every API request
- Implement role-based access control (RBAC)
- Check area-based permissions via `get_managed_area_ids()`

## Input Validation
- Validate all user inputs on both frontend AND backend
- Use Django serializer validation
- Sanitize inputs to prevent XSS
- Use parameterized queries (Django ORM handles this)

## Sensitive Data
- NEVER commit secrets to git
- Use environment variables for:
  - `SECRET_KEY`
  - `DATABASE_URL`
  - API keys
  - JWT secrets
- Add `.env` to `.gitignore`

## API Security
- Rate limiting on authentication endpoints
- CORS configured for allowed origins only
- CSRF protection enabled
- Validate content-type headers

## Code Review Checklist
Before committing, verify:
- [ ] No hardcoded secrets or credentials
- [ ] No sensitive data in logs
- [ ] Permission checks on all endpoints
- [ ] Input validation implemented
- [ ] SQL injection prevention (use ORM)
- [ ] XSS prevention (React escapes by default)

## File Operations
- Validate file types and sizes
- Store uploads outside web root
- Generate unique filenames
- Scan for malware if possible

## Error Handling
- Don't expose stack traces to users
- Log errors with context for debugging
- Return generic error messages to clients
- Use structured error responses
