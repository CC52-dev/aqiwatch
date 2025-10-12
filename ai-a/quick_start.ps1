# Quick Start Script - Installs requirements and starts the monitoring script

Write-Host "========================================"
Write-Host "🌬️  AQI Watch AI Server Quick Start" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

$SCRIPT_DIR = "C:\Users\Administrator\Downloads\aqiwatch\ai-a"
Set-Location $SCRIPT_DIR

# Install requirements
Write-Host "📦 Installing requirements..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Start the monitor in a new window (detached)
Write-Host "🚀 Starting server monitor..." -ForegroundColor Green
Start-Process python -ArgumentList "monitor.py" -WorkingDirectory $SCRIPT_DIR -WindowStyle Hidden

Write-Host "✅ Server monitor started!" -ForegroundColor Green
Write-Host "📁 Logs will be available in: $SCRIPT_DIR\logs" -ForegroundColor Cyan
Write-Host ""

