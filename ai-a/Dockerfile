# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV TF_CPP_MIN_LOG_LEVEL=3
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV TF_CPP_MIN_VLOG_LEVEL=3
# Disable problematic CPU optimizations that cause SIGILL
ENV TF_DISABLE_MKL=1
ENV TF_DISABLE_POOL_ALLOCATOR=1
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

# Install system dependencies and clean up immediately
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with space optimization
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --no-deps tensorflow-cpu==2.10.0 && \
    pip install --no-cache-dir -r requirements.txt && \
    pip cache purge && \
    find /usr/local/lib/python3.9/site-packages -name "*.pyc" -delete && \
    find /usr/local/lib/python3.9/site-packages -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Copy the entire project
COPY . .

# Set permissions for app directory
RUN chmod -R 755 /app

# Expose port 5000
EXPOSE 5000

# Health check with curl installed
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://46.202.82.152/health || exit 1

# Run the server with Gunicorn for production deployment
# Use single worker to avoid TensorFlow threading issues
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "2", "--timeout", "120", "--keep-alive", "2", "--max-requests", "1000", "--max-requests-jitter", "100", "server:app"]
