---
description: Enforce test-driven development workflow for Django + React. Write tests FIRST, then implement. Ensure 80%+ coverage.
---

# TDD Command

This command invokes the **tdd-guide** agent to enforce test-driven development methodology.

## What This Command Does

1. **Scaffold Interfaces** - Define types/interfaces first
2. **Generate Tests First** - Write failing tests (RED)
3. **Implement Minimal Code** - Write just enough to pass (GREEN)
4. **Refactor** - Improve code while keeping tests green (REFACTOR)
5. **Verify Coverage** - Ensure 80%+ test coverage

## When to Use

Use `/tdd` when:
- Implementing new features
- Adding new API endpoints
- Adding new React components
- Fixing bugs (write test that reproduces bug first)
- Refactoring existing code

## TDD Cycle

```
RED → GREEN → REFACTOR → REPEAT

RED:      Write a failing test
GREEN:    Write minimal code to pass
REFACTOR: Improve code, keep tests passing
REPEAT:   Next feature/scenario
```

## Django TDD Example

```python
# Step 1: Write failing test
class AreaViewSetTests(APITestCase):
    def test_create_area_success(self):
        data = {'area_code': 'TEST', 'area_name': 'テスト'}
        response = self.client.post('/api/organizations/areas/', data)
        self.assertEqual(response.status_code, 201)

# Step 2: Run test - verify it fails
# docker-compose exec backend python manage.py test

# Step 3: Implement ViewSet
# Step 4: Run test - verify it passes
# Step 5: Refactor if needed
```

## React TDD Example

```typescript
// Step 1: Write failing test
describe('AreaList', () => {
  it('displays areas', async () => {
    render(<AreaList />);
    await waitFor(() => {
      expect(screen.getByText('東京支社')).toBeInTheDocument();
    });
  });
});

// Step 2: Run test - verify it fails
// npm test

// Step 3: Implement component
// Step 4: Run test - verify it passes
// Step 5: Refactor if needed
```

## Coverage Requirements

- **80% minimum** for all code
- **100%** for permission logic and business logic

## Integration with Other Commands

- Use `/plan` first to understand what to build
- Use `/tdd` to implement with tests
- Use `/build-fix` if build errors occur
- Use `/review` to review implementation
