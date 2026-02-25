# Coding Style Rules

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate:

```javascript
// ❌ WRONG: Mutation
function updateUser(user, name) {
  user.name = name;  // MUTATION!
  return user;
}

// ✅ CORRECT: Immutability
function updateUser(user, name) {
  return {
    ...user,
    name
  };
}
```

## File Organization

MANY SMALL FILES > FEW LARGE FILES:
- 200-400 lines typical
- 800 lines maximum
- Extract utilities from large components
- Organize by feature/domain

## Error Handling

ALWAYS handle errors comprehensively:

```typescript
// React
try {
  const response = await fetch('/api/...');
  if (!response.ok) throw new Error('Request failed');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  setError('操作に失敗しました');
}

// Django
try:
    result = some_operation()
except SomeException as e:
    logger.error(f'Operation failed: {e}')
    raise ValidationError({'error': '操作に失敗しました'})
```

## Input Validation

ALWAYS validate user input on BOTH frontend AND backend:

```typescript
// Frontend - TypeScript
interface AreaFormData {
  area_code: string;
  area_name: string;
}

const validate = (data: AreaFormData): string[] => {
  const errors: string[] = [];
  if (!data.area_code.trim()) errors.push('コードは必須です');
  if (!data.area_name.trim()) errors.push('名前は必須です');
  return errors;
};
```

```python
# Backend - Django Serializer
class AreaSerializer(serializers.ModelSerializer):
    def validate_area_code(self, value):
        if not value.strip():
            raise serializers.ValidationError('エリアコードは必須です')
        return value
```

## Naming Conventions

### Python/Django
- Classes: `PascalCase` (e.g., `AreaManager`)
- Functions/methods: `snake_case` (e.g., `get_managed_area_ids`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `ROLE_CHOICES`)
- Private: `_single_underscore` (e.g., `_get_accessible_area_ids`)

### TypeScript/React
- Components: `PascalCase` (e.g., `AreaManagement`)
- Functions/hooks: `camelCase` (e.g., `useAreas`, `handleSubmit`)
- Constants: `UPPER_SNAKE_CASE` or `PascalCase`
- Interfaces/Types: `PascalCase` (e.g., `AreaProps`)

## Comments & Documentation

### When to Comment
- Complex business logic
- Non-obvious workarounds
- TODO with ticket reference

### When NOT to Comment
- Self-explanatory code
- Obvious operations
- Commented-out code (delete it)

```python
# ✅ GOOD: Explains why, not what
# 親のタイプは自分より上位階層でなければならない
if parent.area_type.hierarchy_level >= area_type.hierarchy_level:
    raise ValidationError(...)

# ❌ BAD: Obvious comment
# Loop through areas
for area in areas:
    ...
```

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No console.log statements (except intentional debugging)
- [ ] No hardcoded values (use constants/env vars)
- [ ] No mutation (immutable patterns used)
- [ ] TypeScript: No implicit `any`
- [ ] Django: QuerySet optimized (select_related/prefetch_related)
