# ✅ AQI Watch AI Server - Setup Complete!

## Status: RUNNING ✓

Your AQI prediction server is now running with automatic restart capabilities!

### Current Status
- **Server Status**: Running on `http://localhost:5000`
- **Health Status**: Healthy ✓
- **ML Model**: Loaded successfully ✓
- **Auto-Restart**: Enabled (every 12 hours or on error)
- **Processes Running**: 2 (monitor + server)

### Quick Tests

#### Health Check
```bash
curl http://localhost:5000/health
```
Response: `{"predictor_loaded":true,"status":"healthy","timestamp":"..."}`

#### Get AQI Overview
```bash
curl "http://localhost:5000/overview?lat=37.7749&lon=-122.4194&use_demo=true"
```

### API Endpoints

1. **Root** - `GET /`
   - API information and usage instructions

2. **Health Check** - `GET /health`
   - Check if server and predictor are loaded

3. **AQI Overview** - `GET /overview`
   - Parameters: `lat`, `lon`, `use_demo` (optional)
   - Returns comprehensive AQI data with predictions

### Files Created

#### Startup Scripts
- `START_HERE.bat` - **Main startup script** (Windows)
- `start.sh` - Unix/Linux startup script
- `start.ps1` - PowerShell startup script
- `start_detached.vbs` - VBScript for detached process launch

#### Monitoring
- `monitor.py` - Python monitoring script (handles auto-restart)
- `RUN_SERVER_NOW.bat` - Alternative startup (runs in foreground)

#### Server Files
- `server.py` - Main Flask API server
- `aqi_predictor.py` - ML prediction model
- `requirements.txt` - Python dependencies

#### Logs
All logs are saved in `logs/` directory:
- `server_YYYYMMDD_HHMMSS.log` - Monitor activity log
- `server_stdout.log` - Server output
- `server_stderr.log` - Server errors

### How to Use

#### Starting the Server
Simply run:
```cmd
START_HERE.bat
```

The server will:
1. Install all required dependencies
2. Start the monitoring script
3. Launch the API server
4. Automatically restart every 12 hours
5. Automatically restart on any crashes

#### Stopping the Server
1. Open Task Manager
2. Find `python.exe` processes
3. End all python.exe processes

Or use PowerShell:
```powershell
Stop-Process -Name python -Force
```

#### Viewing Logs
```cmd
type logs\server_stdout.log
type logs\server_stderr.log
```

Or open the files in the `logs/` directory with any text editor.

### Configuration

#### Change Restart Interval
Edit `monitor.py`, line ~12:
```python
RESTART_INTERVAL = 43200  # 12 hours in seconds
```

Common values:
- 1 hour = 3600
- 6 hours = 21600
- 12 hours = 43200 (default)
- 24 hours = 86400

#### Change Server Port
Edit `server.py`, line ~640:
```python
app.run(host='0.0.0.0', port=5000, debug=False)
```

### Troubleshooting

#### Server Won't Start
1. Check Python is installed: `python --version`
2. Install requirements: `pip install -r requirements.txt`
3. Check logs in `logs/` directory
4. Ensure port 5000 is not in use

#### Health Endpoint Returns Error
1. Wait 30 seconds after startup
2. Check `logs/server_stderr.log` for errors
3. Verify model file exists: `improved_aqi_model.h5`

#### High CPU Usage
This is normal during:
- Initial startup (loading ML model)
- Making predictions
- TensorFlow operations

### Features

#### Automatic Restart
- **Scheduled**: Restarts every 12 hours automatically
- **On Crash**: Restarts immediately if server crashes
- **Logs**: All restart events are logged

#### Health Monitoring
- Checks server status every 30 seconds
- Automatic recovery from crashes
- Detailed logging of all events

#### API Features
- Real-time AQI data from WAQI API
- 7-day historical data
- 7-day future predictions using ML
- Health impact analysis
- Pollutant breakdown
- Seasonal recommendations
- Air quality alerts

### Next Steps

1. **Test the API** - Use the examples above
2. **Integrate with Frontend** - Point your Next.js app to `http://localhost:5000`
3. **Monitor Logs** - Check `logs/` directory regularly
4. **Production Deployment** - See `DOKPLOY_DEPLOYMENT.md` for Docker deployment

### Success Indicators

✓ Python processes running (2 processes)
✓ Health endpoint returns 200 status
✓ Model loaded successfully
✓ Log files being created
✓ Server responds to API requests

---

## 🎉 Your server is ready to use!

For questions or issues, check the logs in the `logs/` directory.

