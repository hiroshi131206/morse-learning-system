# Debug Command

Investigate and diagnose issues in the application.

## Steps

1. **Gather Information**
   - Check Docker container status
   - Review recent logs
   - Identify error patterns

2. **Check Container Status**
   ```bash
   docker-compose ps
   ```

3. **View Logs**
   ```bash
   # Backend logs
   docker-compose logs backend --tail=50

   # Frontend logs
   docker-compose logs frontend --tail=50

   # All services
   docker-compose logs --tail=30
   ```

4. **Common Issues**

   ### Backend Not Starting
   - Check DATABASE_URL in .env
   - Verify migrations are applied
   - Check for Python syntax errors

   ### Frontend Build Errors
   - TypeScript errors
   - Missing dependencies
   - Invalid imports

   ### API Errors
   - 401: Authentication issue
   - 403: Permission denied
   - 404: Resource not found
   - 500: Server error - check backend logs

   ### Database Connection
   - Verify Supabase credentials
   - Check network connectivity
   - Validate DATABASE_URL format

5. **Restart Services**
   ```bash
   docker-compose restart <service>
   ```

## Output Format

```
## Debug Report

### Issue
[Description of the issue]

### Investigation
1. Step taken...
2. Finding...

### Root Cause
[Identified cause]

### Solution
[Steps to fix]

### Prevention
[How to prevent in future]
```
