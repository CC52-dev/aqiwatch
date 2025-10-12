@echo off
REM Simple script to install and run the AQI server with monitoring

cd /d "%~dp0"

echo ================================================
echo   AQI Watch AI Server - Setup and Start
echo ================================================
echo.

REM Step 1: Install requirements
echo [Step 1/2] Installing Python requirements...
python -m pip install --quiet --upgrade pip
python -m pip install --quiet -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)
echo              Done!
echo.

REM Step 2: Start the monitor
echo [Step 2/2] Starting server with auto-restart monitor...
echo.
echo The server will:
echo   - Restart automatically every 12 hours
echo   - Restart automatically on crashes  
echo   - Log all activity to 'logs' folder
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================
echo.

python monitor.py

