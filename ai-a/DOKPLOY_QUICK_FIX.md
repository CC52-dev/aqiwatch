# Dokploy Deployment Quick Fix

## Issues Fixed

### ✅ 1. "no healthcheck" Error
**Problem:** Docker HEALTHCHECK was missing from Dockerfile

**Fix:** Added HEALTHCHECK with extended startup period for ML model loading:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:5000/health || exit 1
```

**Why 120s start period?**
- TensorFlow model loading takes 30-60 seconds
- Container needs time to initialize before health checks
- Prevents false "unhealthy" status during startup

### ✅ 2. Container Crashing Issue
**Problem:** Server was crashing every 30 seconds without clear error messages

**Fixes:**
1. **Enhanced error logging in `server.py`**
   - Shows current directory and files on error
   - Full stack traces
   - Better error messages

2. **Created `diagnose.py`**
   - Validates all dependencies
   - Checks model file exists
   - Tests imports before server starts

3. **Created `entrypoint.sh`**
   - Pre-flight checks before starting
   - Verifies model file exists
   - Runs diagnostics
   - Better startup logging

## Updated Files

### Dockerfile
```dockerfile
# Key changes:
- HEALTHCHECK with 120s start period (for model loading)
- Uses entrypoint.sh for better startup
- Sets proper permissions for all scripts
```

### entrypoint.sh (NEW)
```bash
# Pre-flight checks:
- Verifies model file exists
- Creates logs directory
- Runs diagnostic check
- Shows environment info
- Then starts monitor.py
```

### server.py
```python
# Better error handling:
- Shows directory contents on error
- Full traceback on failures
- Proper sys.exit(1) codes
- FileNotFoundError handling
```

## Deployment Steps

### 1. Push Updated Files
```bash
cd /path/to/aqiwatch/ai-a
git add .
git commit -m "Fix: Added healthcheck and improved error logging"
git push
```

### 2. Rebuild in Dokploy
In Dokploy dashboard:
1. Go to your deployment
2. Click "Redeploy" or trigger new build
3. Watch build logs

### 3. Monitor Deployment

#### Check Build Logs
Look for:
```
✓ Model file found (21M)
✓ Logs directory ready
Running diagnostic check...
[✓] All checks should pass
================================================
Launching Monitor Script
================================================
```

#### Check Container Logs
After deployment, look for:
```
[2025-10-13 ...] 🌬️  AQI Server Monitor Started
[2025-10-13 ...] 🚀 Starting AQI server...
Loading AQI predictor...
Loading ML model from improved_aqi_model.h5...
✅ AQI Predictor initialized successfully
🚀 Server starting on http://0.0.0.0:5000
```

#### Check Health Endpoint
```bash
curl https://your-domain.com/health
```

Should return:
```json
{
  "predictor_loaded": true,
  "status": "healthy",
  "timestamp": "..."
}
```

## If Still Failing

### Get Detailed Logs
In Dokploy, run:
```bash
# View logs
docker logs <container-id> -n 200

# View error logs
docker exec <container-id> cat logs/server_stderr.log

# Run diagnostic
docker exec <container-id> python diagnose.py
```

### Common Issues After Fix

#### Issue 1: Model File Not in Container
**Check:**
```bash
docker exec <container-id> ls -lh improved_aqi_model.h5
```

**Solution:**
Ensure `.dockerignore` doesn't exclude `.h5` files. If it does, remove that line.

#### Issue 2: Timeout During Build
**Symptoms:** Build times out or gets killed

**Solution:**
The TensorFlow installation is large. In Dokploy settings:
- Increase build timeout to 10-15 minutes
- Ensure sufficient memory (2GB+ recommended)

#### Issue 3: Health Check Still Failing
**Check:**
```bash
docker exec <container-id> curl localhost:5000/health
```

**If curl fails:**
Server isn't starting. Check:
```bash
docker exec <container-id> cat logs/server_stderr.log
```

**If curl succeeds but Dokploy says unhealthy:**
Wait 2 minutes (start-period). The health check doesn't start immediately.

## Dokploy Configuration

### Recommended Settings

**Build:**
- Build timeout: 10 minutes
- Build memory: 2GB

**Deployment:**
- Health check grace period: 120 seconds
- Restart policy: always
- Memory limit: 1GB minimum

**Environment Variables (if needed):**
```
PYTHONUNBUFFERED=1
TF_CPP_MIN_LOG_LEVEL=3
```

## Success Indicators

✅ Build completes without errors
✅ Entrypoint script shows all checks passing
✅ Monitor script starts successfully
✅ Server initializes and loads model
✅ Health check returns 200 OK after ~90 seconds
✅ Container stays running (not restarting)

## Quick Test

After deployment:
```bash
# Test health
curl https://your-domain.com/health

# Test API
curl "https://your-domain.com/overview?lat=37.7749&lon=-122.4194&use_demo=true"
```

Both should return valid JSON responses.

## Files Summary

Updated/Created:
- ✅ `Dockerfile` - Added HEALTHCHECK + entrypoint
- ✅ `entrypoint.sh` - Pre-flight checks
- ✅ `server.py` - Better error logging
- ✅ `diagnose.py` - Diagnostic script
- ✅ `TROUBLESHOOTING.md` - Full troubleshooting guide
- ✅ `DOCKER_FIX.md` - Docker-specific fixes

All ready for deployment! 🚀

