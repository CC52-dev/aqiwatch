# TensorFlow "Illegal Instruction" Fix

## Problem
You're experiencing an "Illegal instruction (core dumped)" error when importing TensorFlow. This happens when TensorFlow was compiled with CPU optimizations (AVX, AVX2 instructions) that your CPU doesn't support.

## Diagnosis
```bash
python -c "import numpy; print('NumPy OK')"        # ✓ Works
python -c "import tensorflow; print('TF OK')"      # ✗ Crashes
```

If NumPy works but TensorFlow crashes, your CPU lacks AVX/AVX2 support that TensorFlow 2.16+ requires.

---

## Solution 1: Downgrade TensorFlow (Recommended)

### Quick Fix Commands:

```bash
cd ~/aqiwatch/ai-a
source aqienv/bin/activate

# Uninstall current TensorFlow
pip uninstall -y tensorflow tensorflow-cpu

# Clear cache
pip cache purge

# Install TensorFlow 2.15 (more compatible)
pip install --no-cache-dir "tensorflow-cpu==2.15.0"

# Test it
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__} OK!')"
```

### Or Use the Script:

```bash
chmod +x FIX_TENSORFLOW.sh
source aqienv/bin/activate
./FIX_TENSORFLOW.sh
```

---

## Solution 2: If TensorFlow 2.15 Still Fails

Try TensorFlow 2.12 (older, more compatible):

```bash
source aqienv/bin/activate
pip uninstall -y tensorflow tensorflow-cpu
pip install --no-cache-dir "tensorflow-cpu==2.12.0"
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__} OK!')"
```

---

## Solution 3: Try TensorFlow 2.11 (Maximum Compatibility)

```bash
source aqienv/bin/activate
pip uninstall -y tensorflow tensorflow-cpu
pip install --no-cache-dir "tensorflow-cpu==2.11.0"
```

---

## Solution 4: Check CPU Capabilities

To see what your CPU supports:

```bash
# Check for AVX support
cat /proc/cpuinfo | grep -i avx

# Check all CPU flags
lscpu | grep Flags
```

### What You Need:
- **TensorFlow 2.16+**: Requires AVX2
- **TensorFlow 2.12-2.15**: Requires AVX
- **TensorFlow 2.11 and older**: Works without AVX (SSE4.2 only)

---

## Why This Happens

| TensorFlow Version | CPU Requirements | Notes |
|-------------------|------------------|-------|
| 2.16+ | AVX2 | Latest, fastest, requires modern CPUs |
| 2.12-2.15 | AVX | Good balance |
| 2.11 and older | SSE4.2 | Maximum compatibility, works on older CPUs |

Your CPU doesn't have AVX/AVX2, so TensorFlow 2.20.0 won't work.

---

## Verification

After applying the fix:

```bash
# Test TensorFlow import
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__} works!')"

# Run full diagnostic
python diagnose.py

# Start server
python server.py
```

Expected output:
```
✓ TensorFlow 2.15.0 works!
[✓] Flask      version 3.1.2
[✓] NumPy      version 1.26.4
[✓] TensorFlow version 2.15.0
[✓] Model loaded successfully
```

---

## For Docker Deployments

The `requirements.txt` has been updated to:
```
tensorflow-cpu>=2.12.0,<2.16.0
```

Rebuild your Docker image:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Alternative: Use Intel TensorFlow

If none of the above work, try Intel's optimized TensorFlow:

```bash
pip uninstall -y tensorflow tensorflow-cpu
pip install --no-cache-dir intel-tensorflow
```

This is specifically optimized for Intel CPUs without AVX.

---

## Last Resort: Different Approach

If your CPU is too old for any TensorFlow version:

### Option A: Use ONNX Runtime (Lighter, Faster)
```bash
pip install onnxruntime
# Convert your .h5 model to ONNX format
```

### Option B: Use PyTorch (Alternative ML Framework)
```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### Option C: Run on a Different Server
Your current server's CPU is too old. Consider:
- Upgrading to a newer VPS
- Using a cloud provider with modern CPUs
- Running on a different machine with AVX support

---

## Need More Help?

Check these resources:
- TensorFlow CPU requirements: https://www.tensorflow.org/install/pip
- Your CPU specs: `lscpu`
- TensorFlow compatibility: https://github.com/tensorflow/tensorflow/issues

---

## Summary

**The Real Issue:** TensorFlow 2.20.0+ requires AVX/AVX2 CPU instructions
**The Fix:** Downgrade to TensorFlow 2.12-2.15
**Prevention:** Updated `requirements.txt` to pin TensorFlow < 2.16

Run the commands above and your server should work! 🚀

