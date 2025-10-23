#!/bin/bash
# Fix TensorFlow CPU Compatibility Issue
# TensorFlow 2.16+ requires AVX instructions that your CPU doesn't support

set -e

echo "╔════════════════════════════════════════╗"
echo "║  TensorFlow CPU Compatibility Fix     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if in virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "🔍 Activating virtual environment..."
    source aqienv/bin/activate
fi

echo "✓ Virtual environment: $VIRTUAL_ENV"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Uninstalling incompatible TensorFlow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pip uninstall -y tensorflow tensorflow-cpu 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Clearing pip cache"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pip cache purge

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Installing TensorFlow 2.15 (CPU compatible)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pip install --no-cache-dir "tensorflow-cpu==2.15.0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Testing TensorFlow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if python -c "import tensorflow as tf; print(f'✓ TensorFlow {tf.__version__} works!')" 2>&1 | grep -q "✓"; then
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║       ✓ TENSORFLOW FIXED!             ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "Now test your server:"
    echo "  python diagnose.py"
    echo "  python server.py"
else
    echo ""
    echo "⚠️  TensorFlow 2.15 still has issues"
    echo "   Trying TensorFlow 2.12..."
    echo ""
    
    pip uninstall -y tensorflow-cpu
    pip install --no-cache-dir "tensorflow-cpu==2.12.0"
    
    if python -c "import tensorflow as tf; print(f'✓ TensorFlow {tf.__version__} works!')" 2>&1 | grep -q "✓"; then
        echo "✓ TensorFlow 2.12 works!"
    else
        echo "❌ Still failing. Your CPU may be too old for TensorFlow."
        echo ""
        echo "Options:"
        echo "1. Use Intel TensorFlow (optimized for older CPUs)"
        echo "2. Use a different ML library (PyTorch, ONNX)"
        echo "3. Run on a different server with AVX support"
        exit 1
    fi
fi

echo ""
echo "Testing full diagnostic..."
python diagnose.py

