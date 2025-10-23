# AQI Watch AI Server - Complete Setup Guide

## 🚀 Quick Start

### One-Command Setup (Recommended)

SSH into your server and run:

```bash
cd ~/aqiwatch/ai-a
chmod +x setup_server.sh
sudo ./setup_server.sh
```

This will:
- ✅ Install Python 3.11
- ✅ Install system dependencies
- ✅ Create fresh virtual environment
- ✅ Install all Python packages with CPU-compatible versions
- ✅ Run diagnostics
- ✅ Clean up temporary files

### Start the Server

```bash
cd ~/aqiwatch/ai-a
source aqienv/bin/activate
python server.py
```

---

## 📋 What's Fixed

### The Problem
- **TensorFlow 2.20.0** requires AVX/AVX2 CPU instructions
- **NumPy 2.x** requires AVX/AVX2 CPU instructions
- Older server CPUs don't have these instructions
- Result: `Illegal instruction (core dumped)` error

### The Solution
- ✅ **TensorFlow downgraded to 2.15.0** (CPU compatible)
- ✅ **NumPy pinned to < 2.0.0** (CPU compatible)
- ✅ Fresh Python 3.11 virtual environment
- ✅ All dependencies tested and verified

---

## 🔧 Manual Setup (If Needed)

### Step 1: Install Python 3.11

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev
```

### Step 2: Install System Dependencies

```bash
sudo apt install -y gcc g++ libgomp1 curl
```

### Step 3: Create Virtual Environment

```bash
cd ~/aqiwatch/ai-a
rm -rf aqienv  # Remove old environment
python3.11 -m venv aqienv
source aqienv/bin/activate
```

### Step 4: Install Python Dependencies

```bash
pip install --upgrade pip
pip install --no-cache-dir \
  "flask>=2.3.0" \
  "pandas>=1.5.0" \
  "numpy>=1.21.0,<2.0.0" \
  "matplotlib>=3.5.0" \
  "scikit-learn>=1.1.0" \
  "tensorflow-cpu==2.15.0" \
  "requests>=2.28.0" \
  "gunicorn>=21.2.0"
```

### Step 5: Verify Installation

```bash
python diagnose.py
```

### Step 6: Start Server

```bash
python server.py
```

---

## 📦 Dependencies

| Package | Version | Notes |
|---------|---------|-------|
| Python | 3.11+ | Required |
| Flask | ≥2.3.0 | Web framework |
| Pandas | ≥1.5.0 | Data processing |
| NumPy | ≥1.21.0, <2.0.0 | CPU compatible |
| Matplotlib | ≥3.5.0 | Plotting |
| scikit-learn | ≥1.1.0 | ML utilities |
| TensorFlow CPU | 2.15.0 | CPU compatible, no AVX2 required |
| Requests | ≥2.28.0 | HTTP library |
| Gunicorn | ≥21.2.0 | Production server |

---

## 🐳 Docker Deployment

### Build and Run

```bash
cd ~/aqiwatch/ai-a
docker-compose build --no-cache
docker-compose up -d
```

### Check Logs

```bash
docker-compose logs -f
```

### Stop Server

```bash
docker-compose down
```

---

## 🔍 Troubleshooting

### Server Crashes with "Illegal instruction"

See [TENSORFLOW_CPU_FIX.md](./TENSORFLOW_CPU_FIX.md) or [NUMPY_CPU_FIX.md](./NUMPY_CPU_FIX.md)

### Port Already in Use

```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Model File Missing

Ensure `improved_aqi_model.h5` is in the same directory:
```bash
ls -lh improved_aqi_model.h5
```

### Import Errors

```bash
source aqienv/bin/activate
pip install --no-cache-dir -r requirements.txt
```

---

## 📖 Documentation

- **[SETUP_README.md](./SETUP_README.md)** - This file
- **[TENSORFLOW_CPU_FIX.md](./TENSORFLOW_CPU_FIX.md)** - TensorFlow compatibility guide
- **[NUMPY_CPU_FIX.md](./NUMPY_CPU_FIX.md)** - NumPy compatibility guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Complete troubleshooting guide
- **[FIX_INSTRUCTIONS.txt](./FIX_INSTRUCTIONS.txt)** - Quick reference
- **[RUN_THIS_NOW.txt](./RUN_THIS_NOW.txt)** - Emergency fix instructions

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Python 3.11+ installed: `python3.11 --version`
- [ ] Virtual environment active: `which python` shows `aqienv`
- [ ] NumPy < 2.0.0: `python -c "import numpy; print(numpy.__version__)"`
- [ ] TensorFlow 2.15.0: `python -c "import tensorflow as tf; print(tf.__version__)"`
- [ ] Model file exists: `ls -lh improved_aqi_model.h5`
- [ ] Diagnostic passes: `python diagnose.py`
- [ ] Server starts: `python server.py`
- [ ] Health check works: `curl localhost:5000/health`

---

## 🚀 Production Deployment

### Using Gunicorn

```bash
source aqienv/bin/activate
gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

### Using Docker

```bash
docker-compose up -d
```

### Using systemd

Create `/etc/systemd/system/aqi-server.service`:

```ini
[Unit]
Description=AQI Prediction Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/aqiwatch/ai-a
Environment="PATH=/root/aqiwatch/ai-a/aqienv/bin"
ExecStart=/root/aqiwatch/ai-a/aqienv/bin/python server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable aqi-server
sudo systemctl start aqi-server
sudo systemctl status aqi-server
```

---

## 📞 Support

If you encounter issues:

1. Run diagnostic: `python diagnose.py > diagnostic.log`
2. Check logs: `cat logs/server_stderr.log`
3. Verify CPU: `cat /proc/cpuinfo | grep flags`
4. Check Python version: `python --version`

---

## 🎯 Quick Commands

```bash
# Setup
cd ~/aqiwatch/ai-a && chmod +x setup_server.sh && sudo ./setup_server.sh

# Start server
cd ~/aqiwatch/ai-a && source aqienv/bin/activate && python server.py

# Check health
curl localhost:5000/health

# View logs
tail -f logs/server_stdout.log

# Stop server
pkill -f server.py
```

---

**Last Updated:** 2025-10-23  
**Python Version:** 3.11+  
**TensorFlow Version:** 2.15.0 (CPU-compatible)  
**NumPy Version:** <2.0.0 (CPU-compatible)

