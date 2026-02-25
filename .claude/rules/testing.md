# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL recommended):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (optional but recommended)

## Test-Driven Development

Recommended workflow:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Django Test Commands

```bash
# Run all tests
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test apps.organizations

# Run with verbosity
docker-compose exec backend python manage.py test -v 2

# Run with coverage
docker-compose exec backend coverage run manage.py test
docker-compose exec backend coverage report
```

## React Test Commands

```bash
# Run tests
cd frontend && npm test

# Run with coverage
cd frontend && npm test -- --coverage

# Run specific test file
cd frontend && npm test -- --testPathPattern="AreaManagement"

# Type check
cd frontend && npx tsc --noEmit
```

## What to Test

### Django/DRF
- Model validation (`clean()` method)
- Serializer validation
- ViewSet permissions
- ViewSet CRUD operations
- Custom actions
- Area-based filtering logic
- Role-based access control

### React/TypeScript
- Component renders correctly
- User interactions work
- API calls handle success/error
- Loading states display
- Form validation works

## Test File Organization

### Django
```
apps/
├── organizations/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_models.py
│   │   ├── test_serializers.py
│   │   ├── test_views.py
│   │   └── test_permissions.py
```

### React
```
src/features/
├── areas/
│   ├── __tests__/
│   │   ├── AreaManagement.test.tsx
│   │   └── useAreas.test.ts
```

## Coverage Requirements

- **80% minimum** for all code
- **100% required** for:
  - Permission logic (`get_managed_area_ids()`)
  - Authentication logic
  - Financial calculations (wages)
  - Core business logic

## Agent Support

- **tdd-guide** - Use PROACTIVELY for new features, enforces write-tests-first
- **code-reviewer** - Checks test coverage in reviews
