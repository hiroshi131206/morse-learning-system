# React/TypeScript Coding Rules

## Component Structure
- Use functional components with hooks
- One component per file
- Co-locate styles, types, and tests with components
- Feature-based folder organization

## TypeScript
- Strict mode enabled - no implicit `any`
- Define interfaces for all props and state
- Use `type` for unions, `interface` for objects
- Export types from feature index files

```typescript
// Good
interface UserProps {
  id: string;
  name: string;
  role: UserRole;
}

// Avoid
const user: any = fetchUser();
```

## State Management
- Local state with `useState` for component-specific data
- Redux for global/shared state
- Use selectors for derived state
- Avoid storing derived data in state

## API Calls
- Centralize API calls in feature-specific hooks
- Handle loading and error states
- Use `getAuthHeaders()` for authenticated requests
- Always handle API errors gracefully

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/...', {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    // handle data
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};
```

## MUI Styling
- Use `sx` prop for component-specific styles
- Use theme for consistent colors and spacing
- Avoid inline styles
- Use MUI's responsive breakpoints

```tsx
// Good
<Box sx={{ p: 2, display: 'flex', gap: 2 }}>

// Avoid
<div style={{ padding: 16, display: 'flex' }}>
```

## Form Handling
- Controlled components for all inputs
- Validate on submit and optionally on blur
- Show clear error messages
- Disable submit button during loading

## Performance
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback`
- Use React.memo for pure components
- Avoid unnecessary re-renders
