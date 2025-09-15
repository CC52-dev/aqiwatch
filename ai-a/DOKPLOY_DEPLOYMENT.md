# Dokploy Deployment Guide for AQI Prediction API

This guide shows how to deploy your Flask AQI Prediction API using Dokploy, a self-hostable Platform as a Service (PaaS).

## Prerequisites

1. **Dokploy Server**: Install Dokploy on your VPS or server
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Domain Name**: Optional, but recommended for production

## Deployment Steps

### 1. Prepare Your Repository

Your repository should have:
- `Dockerfile` (already configured)
- `requirements.txt` (with Gunicorn added)
- `server.py` (your Flask application)
- `aqi_predictor.py` (your ML model)
- `improved_aqi_model.h5` (your trained model)

### 2. Create Project in Dokploy

1. **Login to Dokploy Dashboard**
   - Access your Dokploy instance
   - Go to the Projects section

2. **Create New Project**
   - Click "New Project"
   - Choose "Git Repository" as source
   - Connect your GitHub/GitLab repository

3. **Configure Project Settings**
   - **Project Name**: `aqi-prediction-api`
   - **Repository**: Your Git repository URL
   - **Branch**: `main` or your preferred branch
   - **Build Method**: `Dockerfile` (since you have a custom Dockerfile)

### 3. Environment Variables

Add these environment variables in Dokploy:

```bash
# Optional: Override default Flask settings
FLASK_ENV=production
FLASK_DEBUG=False

# Optional: Custom port (default is 5000)
PORT=5000

# Optional: API keys or other secrets
# AQI_API_KEY=your_api_key_here
```

### 4. Build Configuration

Since you're using a custom Dockerfile, Dokploy will automatically:
- Build your Docker image using your `Dockerfile`
- Install all dependencies from `requirements.txt`
- Set up the proper port binding with Gunicorn

### 5. Deploy

1. **Start Deployment**
   - Click "Deploy" in the Dokploy dashboard
   - Dokploy will build your Docker image
   - The build process will install Python dependencies and TensorFlow

2. **Monitor Build Logs**
   - Watch the build logs for any errors
   - The build may take a few minutes due to TensorFlow installation

### 6. Configure Domain (Optional)

1. **Add Custom Domain**
   - Go to your project settings
   - Add your domain name (e.g., `api.yourdomain.com`)
   - Dokploy will handle SSL certificates automatically

2. **DNS Configuration**
   - Point your domain to your Dokploy server's IP
   - Dokploy will handle the rest

## Dockerfile Configuration

Your current Dockerfile is optimized for Dokploy:

```dockerfile
# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV TF_CPP_MIN_LOG_LEVEL=3
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV TF_CPP_MIN_VLOG_LEVEL=3

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Create a non-root user for security
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app
USER appuser

# Expose port 5000
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run with Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "--keep-alive", "2", "--max-requests", "1000", "--max-requests-jitter", "100", "server:app"]
```

## Key Features of This Configuration

### 1. **Proper Port Binding**
- Gunicorn binds to `0.0.0.0:5000` (all interfaces)
- This allows external access from outside the container

### 2. **Production-Ready WSGI Server**
- Uses Gunicorn instead of Flask's development server
- Configured with 2 workers for better performance
- 120-second timeout for ML model predictions
- Request limits to prevent memory leaks

### 3. **Health Checks**
- Built-in health check endpoint at `/health`
- Dokploy can monitor your application health
- Automatic restart if health checks fail

### 4. **Security**
- Runs as non-root user (`appuser`)
- Proper file permissions
- Minimal attack surface

## Testing Your Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-domain.com/health

# AQI overview (replace with your coordinates)
curl "https://your-domain.com/overview?lat=37.7749&lon=-122.4194"

# Demo mode
curl "https://your-domain.com/overview?lat=37.7749&lon=-122.4194&use_demo=true"
```

## Monitoring and Logs

Dokploy provides:
- **Real-time logs**: View application logs in the dashboard
- **Metrics**: CPU, memory, and network usage
- **Health monitoring**: Automatic health checks
- **Scaling**: Easy horizontal scaling if needed

## Troubleshooting

### Common Issues:

1. **Port Not Accessible**
   - Ensure Gunicorn is binding to `0.0.0.0:5000`
   - Check Dokploy port configuration

2. **Build Failures**
   - Check build logs for dependency issues
   - Ensure all files are committed to Git

3. **Memory Issues**
   - TensorFlow can be memory-intensive
   - Consider increasing container memory limits in Dokploy

4. **Slow Startup**
   - TensorFlow model loading takes time
   - Health check has 30-second start period to account for this

## Advantages of Using Dokploy

1. **Self-Hosted**: Full control over your infrastructure
2. **Docker-Native**: Seamless container deployment
3. **Automatic SSL**: Free SSL certificates via Let's Encrypt
4. **Easy Scaling**: Scale up/down as needed
5. **Cost-Effective**: No per-request pricing
6. **Git Integration**: Automatic deployments on push
7. **Environment Management**: Easy environment variable management

## Next Steps

1. Deploy your application using the steps above
2. Test all API endpoints
3. Configure monitoring and alerts
4. Set up automated backups if needed
5. Consider adding a database for persistent data storage

Your AQI Prediction API is now ready for production deployment with Dokploy!
