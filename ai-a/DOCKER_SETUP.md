# Docker Setup and Testing Guide

## Prerequisites

### Install Docker Desktop for Windows

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Start Docker Desktop
4. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

## Building the Docker Image

Once Docker is installed, run:

```bash
cd C:\Users\Administrator\Downloads\aqiwatch\ai-a
docker build -t aqi-server .
```

## Running the Container

### Quick Start
```bash
docker run -d -p 5000:5000 --name aqi-server aqi-server
```

### With Restart Policy
```bash
docker run -d \
  -p 5000:5000 \
  --name aqi-server \
  --restart unless-stopped \
  aqi-server
```

### With Volume for Logs
```bash
docker run -d \
  -p 5000:5000 \
  --name aqi-server \
  --restart unless-stopped \
  -v ${PWD}/logs:/app/logs \
  aqi-server
```

## Testing the Container

### Check Container Status
```bash
docker ps
docker logs aqi-server
```

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test API
```bash
curl "http://localhost:5000/overview?lat=37.7749&lon=-122.4194&use_demo=true"
```

## Container Management

### View Logs
```bash
# Live logs
docker logs -f aqi-server

# Last 50 lines
docker logs --tail 50 aqi-server
```

### Stop Container
```bash
docker stop aqi-server
```

### Start Container
```bash
docker start aqi-server
```

### Restart Container
```bash
docker restart aqi-server
```

### Remove Container
```bash
docker stop aqi-server
docker rm aqi-server
```

## What the Docker Container Does

The Dockerfile is configured to:

1. **Base Image**: Python 3.11-slim (lightweight, compatible)
2. **Install Dependencies**: Automatically installs all requirements
3. **Auto-Restart**: Uses `monitor.py` for automatic restarts
4. **Health Checks**: Docker monitors health every 30 seconds
5. **Port**: Exposes port 5000 for API access
6. **UTF-8 Support**: Proper encoding for emojis/unicode
7. **Restart Policy**: Restarts every 12 hours or on crash

## Docker Compose (Alternative)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  aqi-server:
    build: .
    ports:
      - "5000:5000"
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    environment:
      - PYTHONUNBUFFERED=1
      - TF_CPP_MIN_LOG_LEVEL=3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

Then run:
```bash
docker-compose up -d
```

## Troubleshooting

### Container Exits Immediately
```bash
docker logs aqi-server
```

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port
docker run -p 8080:5000 aqi-server
```

### View Container Resources
```bash
docker stats aqi-server
```

### Execute Command in Container
```bash
docker exec -it aqi-server bash
docker exec aqi-server python --version
```

## Production Deployment

For production (e.g., Dokploy):

1. Build and tag image:
   ```bash
   docker build -t aqi-server:v1.0 .
   ```

2. Push to registry (if using):
   ```bash
   docker tag aqi-server:v1.0 your-registry/aqi-server:v1.0
   docker push your-registry/aqi-server:v1.0
   ```

3. Deploy with orchestration tool (Kubernetes, Docker Swarm, Dokploy, etc.)

See `DOKPLOY_DEPLOYMENT.md` for detailed deployment instructions.

## Testing Without Docker

If Docker is not installed, you can simulate the container behavior:

```powershell
powershell -ExecutionPolicy Bypass -File test_docker_simulation.ps1
```

This will:
- Check Python version
- Install requirements
- Run monitor.py
- Test the health endpoint
- Show what Docker would do

