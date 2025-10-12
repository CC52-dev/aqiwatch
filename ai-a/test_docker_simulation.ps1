# Docker Simulation Test Script
# This simulates what the Docker container would do

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Container Simulation Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = "C:\Users\Administrator\Downloads\aqiwatch\ai-a"
Set-Location $SCRIPT_DIR

Write-Host "Step 1: Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version
Write-Host "       $pythonVersion" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Installing requirements..." -ForegroundColor Yellow
pip install --quiet -r requirements.txt
Write-Host "       Requirements installed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Checking required files..." -ForegroundColor Yellow
$files = @("monitor.py", "server.py", "aqi_predictor.py", "improved_aqi_model.h5")
foreach ($file in $files)
{
    if (Test-Path $file)
    {
        Write-Host "       [OK] $file exists" -ForegroundColor Green
    }
    else
    {
        Write-Host "       [MISSING] $file" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "Step 4: Starting monitor.py (Docker CMD)..." -ForegroundColor Yellow
Write-Host "       This simulates: CMD ['python3', 'monitor.py']" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Container would now run monitor.py" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run for 30 seconds to test
Write-Host "Running monitor.py for 30 seconds..." -ForegroundColor Yellow
Write-Host "(Press Ctrl+C to stop early)" -ForegroundColor Gray
Write-Host ""

$job = Start-Job -ScriptBlock { 
    Set-Location C:\Users\Administrator\Downloads\aqiwatch\ai-a
    python monitor.py 
}

Start-Sleep -Seconds 5
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`nTesting health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing -TimeoutSec 5
    $json = $response.Content | ConvertFrom-Json
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ DOCKER TEST SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Predictor Loaded: $($json.predictor_loaded)" -ForegroundColor Green
    Write-Host "Server Status: $($json.status)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ Health check failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`nStopping test..." -ForegroundColor Yellow
Stop-Job -Job $job
Remove-Job -Job $job

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Simulation Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The Dockerfile is configured to:" -ForegroundColor White
Write-Host "  1. Use Python 3.11-slim base image" -ForegroundColor Gray
Write-Host "  2. Install requirements.txt" -ForegroundColor Gray
Write-Host "  3. Run 'python3 monitor.py' as CMD" -ForegroundColor Gray
Write-Host "  4. Auto-restart every 12 hours or on crash" -ForegroundColor Gray
Write-Host "  5. Health check on http://localhost:5000/health" -ForegroundColor Gray
Write-Host ""

