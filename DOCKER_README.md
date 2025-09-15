# Docker Deployment Guide

This guide explains how to run the AqiWatch application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Option 1: Using Docker Compose (Recommended)

Run both the frontend and AI API together:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

This will start:
- Frontend (Next.js) on http://localhost:3000
- AI API (Flask) on http://https://api.aqi.watch

### Option 2: Individual Services

#### Frontend Only

```bash
# Build the frontend image
docker build -t aqi-frontend .

# Run the frontend container
docker run -p 3000:3000 aqi-frontend
```

#### AI API Only

```bash
# Build the AI API image
docker build -t aqi-api ./ai-a

# Run the AI API container
docker run -p 5000:5000 aqi-api
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_AQI_API_URL=http://https://api.aqi.watch
```

### AI API

The AI API uses hardcoded configuration for simplicity, but you can modify `ai-a/server.py` to use environment variables.

## Production Deployment

### Using Docker Compose

1. Clone the repository
2. Update environment variables in `docker-compose.yml`
3. Run: `docker-compose up -d --build`

### Using Individual Containers

1. Build both images:
   ```bash
   docker build -t aqi-frontend .
   docker build -t aqi-api ./ai-a
   ```

2. Run with proper networking:
   ```bash
   # Create a network
   docker network create aqi-network
   
   # Run AI API
   docker run -d --name aqi-api --network aqi-network -p 5000:5000 aqi-api
   
   # Run Frontend
   docker run -d --name aqi-frontend --network aqi-network -p 3000:3000 -e NEXT_PUBLIC_AQI_API_URL=http://aqi-api:5000 aqi-frontend
   ```

## Troubleshooting

### Frontend Issues

- **Build fails**: Check if all dependencies are in `package.json`
- **API connection fails**: Verify `NEXT_PUBLIC_AQI_API_URL` is correct
- **Port conflicts**: Change ports in `docker-compose.yml`

### AI API Issues

- **Model not found**: Ensure `improved_aqi_model.h5` is in the `ai-a` directory
- **Dependencies missing**: Check `ai-a/requirements.txt`
- **Port conflicts**: Change port mapping in docker-compose.yml

### General Issues

- **Container won't start**: Check logs with `docker-compose logs [service-name]`
- **Network issues**: Ensure both services are on the same network
- **Permission issues**: Check file permissions in the project directory

## Development

For development, it's recommended to run the services locally:

```bash
# Terminal 1: Start AI API
cd ai-a
python server.py

# Terminal 2: Start Frontend
npm run dev
```

## File Structure

```
.
├── Dockerfile                 # Frontend Docker configuration
├── docker-compose.yml        # Multi-service orchestration
├── .dockerignore            # Files to ignore in Docker build
├── ai-a/                    # AI API service
│   ├── Dockerfile           # AI API Docker configuration
│   ├── server.py            # Flask API server
│   └── requirements.txt     # Python dependencies
└── ...                      # Next.js application files
```

## Performance Notes

- The frontend uses Next.js standalone output for optimal Docker performance
- The AI API includes all ML dependencies and models
- Both services are optimized for production deployment
- Consider using a reverse proxy (nginx) for production deployments
