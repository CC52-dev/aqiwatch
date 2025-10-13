# Troubleshooting Guide

## Server Keeps Crashing

### Symptom
```
❌ Server crashed after 30 seconds!
🔄 Restarting in 5 seconds...
```

### Diagnosis Steps

#### 1. Run Diagnostic Script
```bash
# In Docker container
docker exec -it <container-name> python diagnose.py

# Locally
python diagnose.py
```

#### 2. Check Error Logs
```bash
# Docker logs
docker logs <container-name>

# Or view stderr log
docker exec -it <container-name> cat logs/server_stderr.log
```

#### 3. Check if Model File Exists
```bash
# In Docker
docker exec -it <container-name> ls -lh improved_aqi_model.h5

# Locally
ls -lh improved_aqi_model.h5
```

### Common Issues

#### Issue 1: Model File Missing
**Symptom:** `❌ Model file not found`

**Solution:**
1. Ensure `improved_aqi_model.h5` is in the same directory as `server.py`
2. Rebuild Docker image if using Docker:
   ```bash
   docker build --no-cache -t aqi-server .
   ```

#### Issue 2: TensorFlow CPU Errors
**Symptom:** `Illegal instruction (core dumped)` or SIGILL errors

**Solution:**
The Dockerfile already includes fixes. If still happening:
```dockerfile
ENV TF_DISABLE_MKL=1
ENV TF_DISABLE_POOL_ALLOCATOR=1
ENV OMP_NUM_THREADS=1
```

#### Issue 3: Import Errors
**Symptom:** `ModuleNotFoundError: No module named 'tensorflow'`

**Solution:**
```bash
pip install -r requirements.txt
```

#### Issue 4: Port Already in Use
**Symptom:** `Address already in use`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

#### Issue 5: Memory Issues
**Symptom:** Container killed without error, or OOMKilled status

**Solution:**
Increase Docker memory limit:
```bash
docker run -m 2g -p 5000:5000 aqi-server
```

### Debug Mode

#### Run Server Directly (Skip Monitor)
```bash
# Test if server.py works alone
python server.py
```

#### Check Model Loading
```python
from aqi_predictor import AQIPredictor
predictor = AQIPredictor()
predictor.load_model('improved_aqi_model.h5')
print("Model loaded successfully!")
```

#### Test with Verbose Output
```bash
# Remove TensorFlow log suppression temporarily
python -c "
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '0'
from server import *
initialize_predictor()
"
```

## Docker-Specific Issues

### Container Exits Immediately

**Check:**
1. View full logs: `docker logs <container-name>`
2. Run diagnostic: `docker run --rm aqi-server python diagnose.py`
3. Interactive shell: `docker run -it --rm aqi-server /bin/bash`

### Container Crashes on ARM (Apple Silicon)

**Solution:**
Use platform flag:
```bash
docker build --platform linux/amd64 -t aqi-server .
docker run --platform linux/amd64 -p 5000:5000 aqi-server
```

### Can't Connect to Container

**Check:**
1. Container is running: `docker ps`
2. Port is mapped: `docker port <container-name>`
3. From inside container: `docker exec -it <container-name> curl localhost:5000/health`
4. From host: `curl localhost:5000/health`

## Testing Checklist

- [ ] Python 3.11+ installed
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] Model file (`improved_aqi_model.h5`) exists and is ~22MB
- [ ] Port 5000 is available
- [ ] Diagnostic script passes all checks
- [ ] Server starts without errors (`python server.py`)
- [ ] Health endpoint responds (`curl localhost:5000/health`)

## Getting Help

If issues persist:

1. Run and save diagnostic output:
   ```bash
   python diagnose.py > diagnostic_output.txt 2>&1
   ```

2. Collect logs:
   ```bash
   # Docker
   docker logs <container-name> > docker_logs.txt 2>&1
   
   # Local
   cat logs/server_stderr.log > error_logs.txt
   ```

3. Check system info:
   ```bash
   python --version
   docker --version  # if using Docker
   uname -a  # Linux/Mac
   systeminfo  # Windows
   ```

## Quick Fixes

### Reset Everything
```bash
# Stop all containers
docker stop $(docker ps -q)

# Remove containers
docker rm $(docker ps -aq)

# Remove images
docker rmi aqi-server

# Rebuild
cd /path/to/ai-a
docker build -t aqi-server .
docker run -d -p 5000:5000 --name aqi-server aqi-server

# Check logs
docker logs -f aqi-server
```

### Force Clean Install
```bash
# Remove cache
rm -rf __pycache__ logs/*.log

# Reinstall dependencies
pip uninstall -y tensorflow scikit-learn flask
pip install -r requirements.txt

# Test
python diagnose.py
python server.py
```

