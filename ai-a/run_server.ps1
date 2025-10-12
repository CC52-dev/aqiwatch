# AQI Server Monitoring Script (PowerShell)
# Runs server.py with automatic restart every 12 hours or on crash

# Get the directory where this script is located
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Configuration
$RESTART_INTERVAL = 43200  # 12 hours in seconds
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$LOG_FILE = Join-Path $LOG_DIR "server_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Create logs directory if it doesn't exist
if (-not (Test-Path $LOG_DIR)) {
    New-Item -ItemType Directory -Path $LOG_DIR | Out-Null
}

# Function to log messages
function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] $Message"
    Write-Host $logLine
    Add-Content -Path $LOG_FILE -Value $logLine
}

# Function to start server
function Start-Server {
    Log-Message "🚀 Starting AQI server..."
    $script:ServerProcess = Start-Process python -ArgumentList "server.py" -PassThru -NoNewWindow -RedirectStandardOutput "$LOG_DIR\stdout.log" -RedirectStandardError "$LOG_DIR\stderr.log"
    Log-Message "✅ Server started with PID: $($script:ServerProcess.Id)"
}

# Function to stop server
function Stop-Server {
    if ($script:ServerProcess -and -not $script:ServerProcess.HasExited) {
        Log-Message "🛑 Stopping server (PID: $($script:ServerProcess.Id))..."
        try {
            $script:ServerProcess.Kill()
            $script:ServerProcess.WaitForExit(10000)  # Wait up to 10 seconds
            Log-Message "✅ Server stopped"
        } catch {
            Log-Message "⚠️  Error stopping server: $_"
        }
    }
}

# Function to check if server is running
function Test-ServerRunning {
    if ($script:ServerProcess -and -not $script:ServerProcess.HasExited) {
        return $true
    }
    return $false
}

# Handle Ctrl+C gracefully
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Log-Message "📛 Received termination signal"
    Stop-Server
}

Log-Message "========================================"
Log-Message "🌬️  AQI Server Monitor Started"
Log-Message "========================================"
Log-Message "📊 Configuration:"
Log-Message "   - Restart interval: 12 hours"
Log-Message "   - Auto-restart on crash: Enabled"
Log-Message "   - Log file: $LOG_FILE"
Log-Message ""

# Main monitoring loop
$RESTART_COUNT = 0
while ($true) {
    $RESTART_COUNT++
    
    if ($RESTART_COUNT -gt 1) {
        Log-Message "🔄 Restart #$RESTART_COUNT"
    }
    
    # Start the server
    Start-Server
    
    # Record start time
    $START_TIME = Get-Date
    
    # Monitor the server
    while ($true) {
        # Check if server is still running
        if (-not (Test-ServerRunning)) {
            $CURRENT_TIME = Get-Date
            $UPTIME = ($CURRENT_TIME - $START_TIME).TotalSeconds
            Log-Message "❌ Server crashed after $([math]::Round($UPTIME)) seconds!"
            Log-Message "🔄 Restarting in 5 seconds..."
            Start-Sleep -Seconds 5
            break  # Break inner loop to restart server
        }
        
        # Check if it's time for scheduled restart (12 hours)
        $CURRENT_TIME = Get-Date
        $UPTIME = ($CURRENT_TIME - $START_TIME).TotalSeconds
        
        if ($UPTIME -ge $RESTART_INTERVAL) {
            Log-Message "⏰ 12-hour restart interval reached (uptime: $([math]::Round($UPTIME)) seconds)"
            Stop-Server
            Log-Message "🔄 Restarting server..."
            Start-Sleep -Seconds 2
            break  # Break inner loop to restart server
        }
        
        # Check server health every 30 seconds
        Start-Sleep -Seconds 30
    }
}

