# Test Command

Run tests and analyze results for the specified component or feature.

## Steps

1. **Identify Test Scope**
   - Determine which tests to run based on input
   - Check for existing test files

2. **Run Backend Tests**
   ```bash
   docker-compose exec backend python manage.py test <app_name> -v 2
   ```

3. **Run Frontend Type Check**
   ```bash
   cd frontend && npx tsc --noEmit
   ```

4. **Analyze Results**
   - Parse test output
   - Identify failures and errors
   - Suggest fixes for failing tests

## Test Categories

### Backend (Django)
- Model tests
- Serializer tests
- ViewSet tests
- Permission tests
- Integration tests

### Frontend (React)
- Component tests
- Hook tests
- Integration tests
- Type checking

## Output Format

```
## Test Results Summary

### Backend Tests
- Total: X
- Passed: Y
- Failed: Z

### Failed Tests
1. test_name
   - Error: ...
   - Suggested Fix: ...

### Type Check
- Status: PASS/FAIL
- Errors: [list if any]

### Recommendations
- ...
```
