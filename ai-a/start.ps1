# AQI Watch AI Server Startup Script (PowerShell)
# This script installs dependencies and starts the server with auto-restart functionality

Write-Host "========================================"
Write-Host "🌬️  AQI Watch AI Server Startup" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Get the directory where this script is located
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Step 1: Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
if (Test-Path "requirements.txt") {
    python -m pip install --upgrade pip --quiet
    python -m pip install -r requirements.txt --quiet
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ requirements.txt not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "🚀 Starting Server with Auto-Restart" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Step 2: Run the Python monitoring script
python monitor.py

