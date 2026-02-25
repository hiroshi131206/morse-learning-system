# Git & Version Control Rules

## Commit Messages
Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Adding tests
- `chore`: Maintenance tasks

```
feat: Add area manager selection dialog
fix: Resolve user list not updating after creation
refactor: Simplify permission checking logic
```

## AI-Assisted Commits
Always include co-author tag:
```
feat: Implement drag-and-drop for areas

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code improvements
- `docs/` - Documentation updates

Examples:
- `feature/area-manager-dialog`
- `fix/user-creation-refresh`
- `refactor/permission-system`

## Pre-Commit Checklist
- [ ] Code compiles without errors
- [ ] TypeScript type check passes
- [ ] No console.log statements (unless intentional)
- [ ] No commented-out code
- [ ] Tests pass (if applicable)
- [ ] No secrets or credentials

## Pull Request Guidelines
- Clear title describing the change
- Summary of changes
- Test plan or verification steps
- Link to related issues

## What NOT to Commit
- `.env` files with real credentials
- `node_modules/`
- `__pycache__/`
- `.pyc` files
- IDE-specific files
- Build artifacts
