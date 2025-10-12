@echo off
echo ========================================
echo   AQI Watch AI Server Startup
echo ========================================
echo.

cd /d %~dp0

echo [1/2] Installing requirements...
python -m pip install -r requirements.txt --quiet
echo       Done!
echo.

echo [2/2] Starting server monitor...
echo       The monitor will restart the server every 12 hours or on errors
echo       Logs will be in: %~dp0logs\
echo.

start /B python monitor.py

echo.
echo ========================================
echo   Server is starting in the background
echo   Check logs folder for output
echo ========================================
echo.

