#!/bin/bash

# AQI Watch AI Server Startup Script
# This script installs dependencies and starts the server with auto-restart functionality

set -e  # Exit on error during setup

echo "========================================"
echo "🌬️  AQI Watch AI Server Startup"
echo "========================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Step 1: Install dependencies
echo "📦 Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    echo "✅ Dependencies installed successfully"
else
    echo "❌ requirements.txt not found!"
    exit 1
fi

echo ""
echo "========================================"
echo "🚀 Starting Server with Auto-Restart"
echo "========================================"
echo ""

# Step 2: Run the Python monitoring script
python3 monitor.py

