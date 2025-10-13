# Docker Container Crash - Quick Fix

## Your Issue
Server crashes every 30 seconds in Docker container with:
```
❌ Server crashed after 30 seconds!
🔄 Restarting in 5 seconds...
```

## Immediate Actions

### 1. Check What's Actually Failing
```bash
# View error logs (replace container ID with yours)
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 cat logs/server_stderr.log

# Or view last 50 lines
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 tail -50 logs/server_stderr.log
```

### 2. Run Diagnostics
```bash
# Run diagnostic inside container
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 python diagnose.py
```

### 3. Test Server Directly (Skip Monitor)
```bash
# Run server.py directly to see errors
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 python server.py
```

## Most Likely Causes

### Cause 1: Model File Missing (Most Common)
The `improved_aqi_model.h5` file may not be in the container.

**Check:**
```bash
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 ls -lh improved_aqi_model.h5
```

**Fix:** Rebuild with `--no-cache`:
```bash
docker build --no-cache -t aqi-server .
```

### Cause 2: TensorFlow CPU Incompatibility
Wrong CPU instructions causing SIGILL error.

**Fix:** Already in Dockerfile, but if still failing, use different base image:
```dockerfile
FROM python:3.11-slim-bullseye  # More compatible
```

### Cause 3: Import/Dependency Error
Missing or incompatible Python packages.

**Check:**
```bash
docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 python -c "import tensorflow; print(tensorflow.__version__)"
```

## Updated Files

I've updated the following files with better error handling:

### ✅ server.py
- Added detailed error logging
- Shows current directory and files on error
- Prints full traceback on failure
- Proper exit codes

### ✅ diagnose.py (NEW)
- Comprehensive diagnostic script
- Checks all dependencies
- Tests model loading
- Validates environment

### ✅ TROUBLESHOOTING.md (NEW)
- Complete troubleshooting guide
- Common issues and solutions
- Debug commands

## Rebuild and Restart

```bash
# 1. Stop current container
docker stop xsgk0s4o0000sg00g0wog4s4-000211020993

# 2. Remove old container
docker rm xsgk0s4o0000sg00g0wog4s4-000211020993

# 3. Navigate to ai-a directory
cd /path/to/aqiwatch/ai-a

# 4. Rebuild (no cache to ensure fresh build)
docker build --no-cache -t aqi-server .

# 5. Run with better logging
docker run -d \
  -p 5000:5000 \
  --name aqi-server \
  --restart unless-stopped \
  aqi-server

# 6. Watch logs in real-time
docker logs -f aqi-server
```

## What to Look For in Logs

### ✅ Good Startup:
```
Loading AQI predictor...
Loading ML model from improved_aqi_model.h5...
✅ AQI Predictor initialized successfully
🚀 Server starting on http://0.0.0.0:5000
 * Serving Flask app 'server'
 * Running on http://0.0.0.0:5000
```

### ❌ Bad Startup (Model Missing):
```
Loading AQI predictor...
Loading ML model from improved_aqi_model.h5...
❌ Model file not found: [Errno 2] No such file or directory
Current directory: /app
Files in directory: ['server.py', 'monitor.py', ...]
```

### ❌ Bad Startup (TensorFlow Error):
```
Illegal instruction (core dumped)
```

### ❌ Bad Startup (Import Error):
```
ModuleNotFoundError: No module named 'tensorflow'
```

## Test When Fixed

```bash
# 1. Check health
curl http://localhost:5000/health

# Should return:
# {"predictor_loaded":true,"status":"healthy","timestamp":"..."}

# 2. Test API
curl "http://localhost:5000/overview?lat=37.7749&lon=-122.4194&use_demo=true"

# Should return JSON with AQI data
```

## Need More Help?

1. **Get full error log:**
   ```bash
   docker logs xsgk0s4o0000sg00g0wog4s4-000211020993 > error_log.txt 2>&1
   ```

2. **Run diagnostic:**
   ```bash
   docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 python diagnose.py > diagnostic.txt 2>&1
   ```

3. **Interactive debugging:**
   ```bash
   docker exec -it xsgk0s4o0000sg00g0wog4s4-000211020993 /bin/bash
   # Then inside container:
   python diagnose.py
   python server.py
   ```

## Summary

The updated `server.py` now has much better error logging. After rebuilding, you'll see exactly what's failing in the Docker logs. Most likely it's either:
1. Model file not being copied to container
2. TensorFlow CPU compatibility issue
3. Missing dependency

Run the commands above to diagnose and fix!

