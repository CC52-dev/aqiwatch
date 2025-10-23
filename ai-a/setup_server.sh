#!/bin/bash
# Smart Python 3.11 Dependency Installer with CPU Compatibility Detection

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PYTHON 3.11 DEPENDENCY INSTALLER (CPU-COMPATIBLE)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Upgrade pip first
echo "Upgrading pip..."
python3.11 -m pip install --upgrade pip

# Install basic dependencies
echo "Installing Flask..."
python3.11 -m pip install --no-cache-dir "flask>=2.3.0"

echo "Installing Pandas..."
python3.11 -m pip install --no-cache-dir "pandas>=1.5.0"

echo "Installing NumPy (CPU-compatible)..."
python3.11 -m pip install --no-cache-dir "numpy>=1.21.0,<2.0.0"

echo "Installing Matplotlib..."
python3.11 -m pip install --no-cache-dir "matplotlib>=3.5.0"

echo "Installing scikit-learn..."
python3.11 -m pip install --no-cache-dir "scikit-learn>=1.1.0"

echo "Installing Requests..."
python3.11 -m pip install --no-cache-dir "requests>=2.28.0"

echo "Installing Gunicorn..."
python3.11 -m pip install --no-cache-dir "gunicorn>=21.2.0"

# Smart TensorFlow installation with fallback
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installing TensorFlow (trying compatible versions)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Try TensorFlow 2.15.0 first
if python3.11 -m pip install --no-cache-dir "tensorflow-cpu==2.15.0" && \
   python3.11 -c "import tensorflow as tf; print('TensorFlow 2.15.0 OK')" 2>/dev/null; then
    echo "✓ TensorFlow 2.15.0 installed successfully!"
else
    echo "⚠️  TensorFlow 2.15.0 failed, trying 2.12.0..."
    python3.11 -m pip uninstall -y tensorflow tensorflow-cpu 2>/dev/null || true
    
    if python3.11 -m pip install --no-cache-dir "tensorflow-cpu==2.12.0" && \
       python3.11 -c "import tensorflow as tf; print('TensorFlow 2.12.0 OK')" 2>/dev/null; then
        echo "✓ TensorFlow 2.12.0 installed successfully!"
    else
        echo "⚠️  TensorFlow 2.12.0 failed, trying 2.11.0..."
        python3.11 -m pip uninstall -y tensorflow tensorflow-cpu 2>/dev/null || true
        
        if python3.11 -m pip install --no-cache-dir "tensorflow-cpu==2.11.0" && \
           python3.11 -c "import tensorflow as tf; print('TensorFlow 2.11.0 OK')" 2>/dev/null; then
            echo "✓ TensorFlow 2.11.0 installed successfully!"
        else
            echo "❌ All TensorFlow versions failed. Your CPU may be too old."
            echo "   Check CPU flags: cat /proc/cpuinfo | grep flags"
            exit 1
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verifying Installation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python3.11 -c "import flask; print('✓ Flask:', flask.__version__)"
python3.11 -c "import numpy; print('✓ NumPy:', numpy.__version__)"
python3.11 -c "import tensorflow as tf; print('✓ TensorFlow:', tf.__version__)"
python3.11 -c "import sklearn; print('✓ scikit-learn:', sklearn.__version__)"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✓ INSTALLATION COMPLETE!                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "All dependencies installed successfully!"
echo "Run your server with: python3.11 server.py"
echo ""
