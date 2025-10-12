@echo off
REM Complete startup script - installs requirements and starts server

cd /d "%~dp0"

echo ================================================
echo   AQI Watch AI Server - Complete Setup
echo ================================================
echo.

REM Step 1: Install requirements
echo [1/2] Installing Python requirements...
python -m pip install --quiet --upgrade pip
python -m pip install --quiet -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)
echo       Done!
echo.

REM Step 2: Start the monitor detached
echo [2/2] Starting server monitor (detached)...
cscript //nologo start_detached.vbs

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo The server is now running in the background.
echo.
echo To check status:
echo   - Check logs in: %~dp0logs
echo   - Test API: http://localhost:5000/health
echo.
echo To stop the server:
echo   - Use Task Manager to end python.exe processes
echo.

pause

