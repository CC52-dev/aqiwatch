# NumPy "Illegal Instruction" Fix

## Problem
You're experiencing an "Illegal instruction (core dumped)" error when importing NumPy. This happens when NumPy was compiled with CPU optimizations (AVX, AVX2, SSE instructions) that your CPU doesn't support.

## The Error
```
[✓] Flask                version 3.1.2
[✓] NumPy                version 2.3.4
Illegal instruction (core dumped)
```

---

## Solution 1: Quick Fix (Recommended)

### On Your Server

1. **Make the fix script executable:**
   ```bash
   chmod +x fix_numpy.sh
   ```

2. **Activate your virtual environment:**
   ```bash
   source aqienv/bin/activate
   ```

3. **Run the fix script:**
   ```bash
   ./fix_numpy.sh
   ```

This will:
- Uninstall NumPy 2.3.4
- Install NumPy 1.x (more CPU compatible)
- Verify it works

---

## Solution 2: Manual Fix

If the script doesn't work, do this manually:

```bash
# Activate virtual environment
source aqienv/bin/activate

# Uninstall NumPy
pip uninstall -y numpy

# Clear cache
pip cache purge

# Install compatible NumPy version
pip install --no-cache-dir "numpy>=1.21.0,<2.0.0"

# Test it
python -c "import numpy; print(numpy.__version__)"
```

---

## Solution 3: Build from Source (Slowest, but works everywhere)

If the above doesn't work, build NumPy from source:

```bash
source aqienv/bin/activate
pip uninstall -y numpy
pip install --no-cache-dir --no-binary :all: "numpy==1.26.4"
```

This takes 5-10 minutes but compiles NumPy specifically for your CPU.

---

## Solution 4: For Docker Deployments

The Dockerfile has been updated to use NumPy 1.x. Rebuild your Docker image:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Why This Happens

1. **NumPy 2.x** uses aggressive CPU optimizations by default
2. Your server CPU is older or doesn't support AVX/AVX2 instructions
3. Pre-compiled wheels (from PyPI) assume modern CPUs
4. When NumPy tries to use unsupported instructions → SIGILL (illegal instruction)

## Prevention

The `requirements.txt` has been updated to:
```
numpy<2.0.0,>=1.21.0
```

This ensures NumPy 1.x is installed, which has better CPU compatibility.

---

## Verification

After applying the fix, verify it works:

```bash
python diagnose.py
```

You should see:
```
[✓] NumPy                version 1.26.x
[✓] TensorFlow          version 2.x.x
```

Without the "Illegal instruction" error.

---

## Alternative: Check Your CPU

To see what instructions your CPU supports:

```bash
cat /proc/cpuinfo | grep flags
```

Look for: `sse`, `sse2`, `avx`, `avx2`

If you don't see `avx` or `avx2`, you **must** use NumPy 1.x or build from source.

---

## Need More Help?

If you still have issues:

1. Check Python version: `python --version`
2. Check pip version: `pip --version`
3. Try Python 3.11: `apt install python3.11`
4. Create fresh virtual environment

```bash
python3.11 -m venv new_venv
source new_venv/bin/activate
pip install -r requirements.txt
```

