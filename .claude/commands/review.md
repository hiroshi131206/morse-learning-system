# Code Review Command

Perform a comprehensive code review of the specified files or recent changes.

## Review Checklist

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user inputs
- [ ] Permission checks implemented
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

### Code Quality
- [ ] Follows project coding standards
- [ ] No duplicate code
- [ ] Functions are single-purpose
- [ ] Variable names are descriptive
- [ ] No unused imports or variables

### Django-Specific
- [ ] QuerySet optimization (select_related, prefetch_related)
- [ ] No N+1 queries
- [ ] Proper serializer validation
- [ ] Permission classes applied
- [ ] Appropriate HTTP status codes

### React-Specific
- [ ] TypeScript types defined
- [ ] No implicit any
- [ ] Proper error handling
- [ ] Loading states handled
- [ ] Memory leaks prevented (cleanup in useEffect)

### Performance
- [ ] No unnecessary re-renders
- [ ] Expensive operations memoized
- [ ] Database queries optimized
- [ ] API calls minimized

## Output Format

```
## Code Review Summary

### Files Reviewed
- file1.py
- file2.tsx

### Issues Found
1. **[CRITICAL]** Description of critical issue
   - Location: file:line
   - Recommendation: ...

2. **[WARNING]** Description of warning
   - Location: file:line
   - Recommendation: ...

3. **[SUGGESTION]** Description of suggestion
   - Location: file:line
   - Recommendation: ...

### Positive Observations
- Good use of ...
- Well-structured ...
```
