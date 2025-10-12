# AQI Watch AI Server

Air Quality Index prediction API with TensorFlow machine learning model.

## Quick Start

### Windows
```cmd
START_HERE.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Docker
```bash
docker build -t aqi-server .
docker run -d -p 5000:5000 --restart unless-stopped aqi-server
```

## Features

- **Real-time AQI predictions** using TensorFlow ML model
- **Auto-restart** every 12 hours or on crash
- **7-day forecasting** with historical analysis
- **Health monitoring** and comprehensive logging
- **RESTful API** with health checks
- **Docker ready** with optimized configuration

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### AQI Overview
```bash
GET http://localhost:5000/overview?lat=37.7749&lon=-122.4194
```

Parameters:
- `lat` - Latitude (required)
- `lon` - Longitude (required)
- `use_demo` - Use demo data (optional, default: false)

## Files

### Core Application
- `server.py` - Flask API server
- `aqi_predictor.py` - ML prediction model
- `monitor.py` - Auto-restart monitoring script
- `improved_aqi_model.h5` - Trained TensorFlow model

### Configuration
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container configuration

### Startup Scripts
- `START_HERE.bat` - Windows launcher
- `start.sh` - Linux/Mac launcher
- `start.ps1` - PowerShell launcher

### Documentation
- `API_README.md` - Detailed API documentation
- `DOKPLOY_DEPLOYMENT.md` - Production deployment guide

## Installation

### Requirements
- Python 3.11+
- TensorFlow CPU 2.20.0+
- Flask 2.3.0+

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Usage

### Direct Run
```bash
python server.py
```

### With Auto-Restart
```bash
python monitor.py
```

### Docker
```bash
# Build
docker build -t aqi-server .

# Run
docker run -d \
  -p 5000:5000 \
  --name aqi-server \
  --restart unless-stopped \
  -v $(pwd)/logs:/app/logs \
  aqi-server

# Check logs
docker logs -f aqi-server

# Stop
docker stop aqi-server
```

## Auto-Restart Features

The monitor script provides:
- ✅ Automatic restart every 12 hours
- ✅ Crash detection and recovery
- ✅ Health monitoring (checks every 30s)
- ✅ Comprehensive logging to `logs/` directory
- ✅ Graceful shutdown handling

## Configuration

### Change Restart Interval
Edit `monitor.py` line 15:
```python
RESTART_INTERVAL = 43200  # 12 hours in seconds
```

### Change Server Port
Edit `server.py` line 640:
```python
app.run(host='0.0.0.0', port=5000, debug=False)
```

## Logs

All logs saved to `logs/` directory:
- `server_YYYYMMDD_HHMMSS.log` - Monitor activity
- `server_stdout.log` - Server output
- `server_stderr.log` - Error logs

## Troubleshooting

### Server won't start
1. Check Python version: `python --version`
2. Install requirements: `pip install -r requirements.txt`
3. Verify model file exists: `improved_aqi_model.h5`
4. Check logs in `logs/` directory

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Docker issues
```bash
# View logs
docker logs aqi-server

# Rebuild
docker stop aqi-server
docker rm aqi-server
docker build -t aqi-server .
docker run -d -p 5000:5000 aqi-server
```

## Production Deployment

See `DOKPLOY_DEPLOYMENT.md` for detailed production deployment instructions including:
- Dokploy configuration
- Environment variables
- Resource limits
- Monitoring setup
- SSL/TLS configuration

## License

See LICENSE file for details.

## Support

For issues or questions, check:
1. `logs/` directory for error messages
2. `API_README.md` for API documentation
3. `DOKPLOY_DEPLOYMENT.md` for deployment help
