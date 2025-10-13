#!/bin/bash
set -e

echo "================================================"
echo "Starting AQI Watch Server"
echo "================================================"
echo "Time: $(date)"
echo "Working directory: $(pwd)"
echo "Python version: $(python3 --version)"
echo ""

# Check if model file exists
if [ ! -f "improved_aqi_model.h5" ]; then
    echo "ERROR: Model file 'improved_aqi_model.h5' not found!"
    echo "Files in directory:"
    ls -lh
    exit 1
fi

echo "✓ Model file found ($(du -h improved_aqi_model.h5 | cut -f1))"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs
echo "✓ Logs directory ready"
echo ""

# Run diagnostic check
echo "Running diagnostic check..."
python3 diagnose.py || echo "Warning: Diagnostic check had issues"
echo ""

echo "================================================"
echo "Launching Monitor Script"
echo "================================================"
echo ""

# Start the monitor script
exec python3 monitor.py

