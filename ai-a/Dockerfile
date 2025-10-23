# Use Python 3.11 slim image as base (good balance of compatibility and features)
FROM python:3.11-slim

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
# Set UTF-8 encoding for proper emoji/unicode support
ENV PYTHONIOENCODING=utf-8
ENV LANG=C.UTF-8

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

# Install Python dependencies with space optimization and CPU compatibility
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip cache purge && \
    find /usr/local/lib/python3.11/site-packages -name "*.pyc" -delete && \
    find /usr/local/lib/python3.11/site-packages -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Verify NumPy works (catch CPU incompatibility early)
RUN python -c "import numpy; print('NumPy version:', numpy.__version__); numpy.array([1,2,3])"

# Copy the entire project
COPY . .

# Set permissions for scripts
RUN chmod +x start.sh entrypoint.sh diagnose.py && chmod -R 755 /app

# Expose port 5000
EXPOSE 5000

# Use entrypoint script for better startup logging and validation
ENTRYPOINT ["/app/entrypoint.sh"]
