# AQI Watch AI Server - Startup Guide

## Overview
This directory contains the AQI prediction API server with automatic restart capabilities.

## Quick Start

### Option 1: Simple Start (Recommended for Testing)
Just run the server directly:
```bash
python server.py
```

### Option 2: With Auto-Restart Monitoring
The monitor script will automatically restart the server every 12 hours or when it crashes.

#### On Windows:
```cmd
run.bat
```

Or using PowerShell:
```powershell
python monitor.py
```

#### On Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

## Files

- `server.py` - Main AQI prediction API server
- `monitor.py` - Python script that monitors and restarts the server
- `aqi_predictor.py` - AQI prediction model logic
- `requirements.txt` - Python dependencies
- `run.bat` - Windows batch file to install requirements and start monitor
- `start.sh` / `start.ps1` - Unix/PowerShell startup scripts
- `run_server.sh` / `run_server.ps1` - Unix/PowerShell monitoring scripts

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure the model file exists:
- `improved_aqi_model.h5` should be in this directory

## Features

### Automatic Restart
The monitoring system will:
- Restart the server every 12 hours (configurable)
- Automatically restart if the server crashes
- Log all events to `logs/` directory
- Monitor server health every 30 seconds

### Logs
All logs are saved in the `logs/` directory:
- `server_YYYYMMDD_HHMMSS.log` - Monitor log
- `server_stdout.log` - Server standard output  
- `server_stderr.log` - Server error output

## API Endpoints

Once running, the server will be available at `http://localhost:5000`:

- `GET /` - API information
- `GET /health` - Health check
- `GET /overview?lat=<latitude>&lon=<longitude>` - Get AQI overview

Example:
```bash
curl http://localhost:5000/health
curl "http://localhost:5000/overview?lat=37.7749&lon=-122.4194"
```

## Configuration

Edit `monitor.py` to change restart interval:
```python
RESTART_INTERVAL = 43200  # 12 hours in seconds
```

## Troubleshooting

### Server won't start
1. Check if requirements are installed: `pip list`
2. Verify model file exists: check for `improved_aqi_model.h5`
3. Check logs in the `logs/` directory
4. Ensure port 5000 is not in use

### Monitor issues
1. Run server directly first: `python server.py`
2. Check Python version: `python --version` (requires Python 3.7+)
3. View logs: `type logs\server_stderr.log` (Windows) or `cat logs/server_stderr.log` (Unix)

## Docker Deployment

For production deployment, use the provided Dockerfile:
```bash
docker build -t aqi-server .
docker run -p 5000:5000 aqi-server
```

See `DOKPLOY_DEPLOYMENT.md` for detailed deployment instructions.

