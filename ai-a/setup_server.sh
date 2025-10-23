#!/bin/bash
# Complete Server Setup Script for AQI Watch AI Server
# This script installs Python 3.11, sets up environment, and installs all dependencies

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        AQI Watch AI Server - Complete Setup                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo "✓ Running as root"
else
    echo "⚠️  Not running as root. Some steps may require sudo."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Installing Python 3.11"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Python 3.11 is already installed
if command -v python3.11 &> /dev/null; then
    echo "✓ Python 3.11 already installed: $(python3.11 --version)"
else
    echo "Installing Python 3.11..."
    apt update
    apt install -y software-properties-common
    add-apt-repository -y ppa:deadsnakes/ppa
    apt update
    apt install -y python3.11 python3.11-venv python3.11-dev
    echo "✓ Python 3.11 installed: $(python3.11 --version)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Installing System Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

apt install -y gcc g++ libgomp1 curl

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Cleaning Up Old Environments"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Backup and remove old virtual environment
if [ -d "aqienv" ]; then
    echo "Removing old virtual environment..."
    rm -rf aqienv_backup 2>/dev/null || true
    mv aqienv aqienv_backup
    echo "✓ Old environment backed up to aqienv_backup"
fi

# Remove Python cache files
echo "Cleaning Python cache files..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true

# Remove temporary fix scripts (keep main documentation)
echo "Removing temporary files..."
rm -f ONE_LINE_FIX.sh 2>/dev/null || true
rm -f QUICK_FIX.sh 2>/dev/null || true
rm -f fix_numpy.sh 2>/dev/null || true

echo "✓ Cleanup complete"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Creating Fresh Virtual Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python3.11 -m venv --clear aqienv
source aqienv/bin/activate

echo "✓ Virtual environment created with Python $(python --version)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Upgrading pip"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

pip install --upgrade pip
echo "✓ pip upgraded to $(pip --version)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Installing Python Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Installing packages (this may take 5-10 minutes)..."

# Install dependencies one by one with progress
pip install --no-cache-dir "flask>=2.3.0"
echo "  ✓ Flask installed"

pip install --no-cache-dir "pandas>=1.5.0"
echo "  ✓ Pandas installed"

pip install --no-cache-dir "numpy>=1.21.0,<2.0.0"
echo "  ✓ NumPy installed (CPU-compatible version)"

pip install --no-cache-dir "matplotlib>=3.5.0"
echo "  ✓ Matplotlib installed"

pip install --no-cache-dir "scikit-learn>=1.1.0"
echo "  ✓ scikit-learn installed"

pip install --no-cache-dir "tensorflow-cpu==2.15.0"
echo "  ✓ TensorFlow 2.15.0 installed (CPU-compatible version)"

pip install --no-cache-dir "requests>=2.28.0"
echo "  ✓ Requests installed"

pip install --no-cache-dir "gunicorn>=21.2.0"
echo "  ✓ Gunicorn installed"

echo ""
echo "✓ All dependencies installed successfully!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7: Verifying Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python -c "import flask; print('✓ Flask:', flask.__version__)" || echo "✗ Flask failed"
python -c "import numpy; print('✓ NumPy:', numpy.__version__)" || echo "✗ NumPy failed"
python -c "import tensorflow as tf; print('✓ TensorFlow:', tf.__version__)" || echo "✗ TensorFlow failed"
python -c "import sklearn; print('✓ scikit-learn:', sklearn.__version__)" || echo "✗ scikit-learn failed"
python -c "import pandas; print('✓ Pandas:', pandas.__version__)" || echo "✗ Pandas failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 8: Running Full Diagnostic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "diagnose.py" ]; then
    python diagnose.py
else
    echo "⚠️  diagnose.py not found, skipping diagnostic"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              ✓ SETUP COMPLETE!                            ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Your server is now ready to run!"
echo ""
echo "To start the server:"
echo "  cd $SCRIPT_DIR"
echo "  source aqienv/bin/activate"
echo "  python server.py"
echo ""
echo "To remove the old backup (if everything works):"
echo "  rm -rf aqienv_backup"
echo ""

