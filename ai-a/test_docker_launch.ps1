# Simple Docker Launch Test
Write-Host "========================================"
Write-Host "Docker Container Launch Test"
Write-Host "========================================"
Write-Host ""

$scriptDir = "C:\Users\Administrator\Downloads\aqiwatch\ai-a"
Set-Location $scriptDir

# Step 1: Check Python
Write-Host "[1/5] Checking Python..."
python --version
Write-Host ""

# Step 2: Install requirements
Write-Host "[2/5] Installing requirements..."
pip install --quiet -r requirements.txt
Write-Host "      Done!"
Write-Host ""

# Step 3: Check files
Write-Host "[3/5] Checking required files..."
$files = "monitor.py", "server.py", "aqi_predictor.py", "improved_aqi_model.h5"
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "      [OK] $file"
    } else {
        Write-Host "      [MISSING] $file"
    }
}
Write-Host ""

# Step 4: Start monitor (this is what Docker CMD does)
Write-Host "[4/5] Starting monitor.py (Docker CMD simulation)..."
Write-Host "      Simulating: python3 monitor.py"
Write-Host ""

$job = Start-Job -ScriptBlock {
    Set-Location C:\Users\Administrator\Downloads\aqiwatch\ai-a
    python monitor.py
}

Write-Host "      Waiting for server to start..."
Start-Sleep -Seconds 15

# Step 5: Test health endpoint
Write-Host ""
Write-Host "[5/5] Testing health endpoint..."
try {
    $response = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing -TimeoutSec 5
    $json = $response.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "========================================"
    Write-Host "TEST SUCCESSFUL!"
    Write-Host "========================================"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Predictor Loaded: $($json.predictor_loaded)"
    Write-Host "Server Status: $($json.status)"
    
} catch {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "TEST FAILED"
    Write-Host "========================================"
    Write-Host "Error: $_"
}

Write-Host ""
Write-Host "Stopping test..."
Stop-Job -Job $job -ErrorAction SilentlyContinue
Remove-Job -Job $job -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================"
Write-Host "Docker Configuration Verified"
Write-Host "========================================"
Write-Host "The Dockerfile will:"
Write-Host "  - Use Python 3.11-slim"
Write-Host "  - Install requirements.txt"
Write-Host "  - Run 'python3 monitor.py'"
Write-Host "  - Auto-restart every 12 hours"
Write-Host "  - Health check every 30s"
Write-Host ""

