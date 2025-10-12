#!/bin/bash

# AQI Server Monitoring Script
# Runs server.py with automatic restart every 12 hours or on crash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Configuration
RESTART_INTERVAL=43200  # 12 hours in seconds
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/server_$(date +%Y%m%d_%H%M%S).log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to start server
start_server() {
    log_message "🚀 Starting AQI server (PID will be captured)..."
    python3 server.py 2>&1 | tee -a "$LOG_FILE" &
    SERVER_PID=$!
    log_message "✅ Server started with PID: $SERVER_PID"
}

# Function to stop server
stop_server() {
    if [ ! -z "$SERVER_PID" ] && kill -0 $SERVER_PID 2>/dev/null; then
        log_message "🛑 Stopping server (PID: $SERVER_PID)..."
        kill -TERM $SERVER_PID 2>/dev/null || true
        
        # Wait up to 10 seconds for graceful shutdown
        for i in {1..10}; do
            if ! kill -0 $SERVER_PID 2>/dev/null; then
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if kill -0 $SERVER_PID 2>/dev/null; then
            log_message "⚠️  Force killing server..."
            kill -KILL $SERVER_PID 2>/dev/null || true
        fi
        
        log_message "✅ Server stopped"
    fi
}

# Function to check if server is running
is_server_running() {
    if [ ! -z "$SERVER_PID" ] && kill -0 $SERVER_PID 2>/dev/null; then
        return 0  # Server is running
    else
        return 1  # Server is not running
    fi
}

# Trap signals for graceful shutdown
trap 'log_message "📛 Received termination signal"; stop_server; exit 0' SIGTERM SIGINT

log_message "========================================"
log_message "🌬️  AQI Server Monitor Started"
log_message "========================================"
log_message "📊 Configuration:"
log_message "   - Restart interval: 12 hours"
log_message "   - Auto-restart on crash: Enabled"
log_message "   - Log file: $LOG_FILE"
log_message ""

# Main monitoring loop
RESTART_COUNT=0
while true; do
    RESTART_COUNT=$((RESTART_COUNT + 1))
    
    if [ $RESTART_COUNT -gt 1 ]; then
        log_message "🔄 Restart #$RESTART_COUNT"
    fi
    
    # Start the server
    start_server
    
    # Record start time
    START_TIME=$(date +%s)
    
    # Monitor the server
    while true; do
        # Check if server is still running
        if ! is_server_running; then
            CURRENT_TIME=$(date +%s)
            UPTIME=$((CURRENT_TIME - START_TIME))
            log_message "❌ Server crashed after $UPTIME seconds!"
            log_message "🔄 Restarting in 5 seconds..."
            sleep 5
            break  # Break inner loop to restart server
        fi
        
        # Check if it's time for scheduled restart (12 hours)
        CURRENT_TIME=$(date +%s)
        UPTIME=$((CURRENT_TIME - START_TIME))
        
        if [ $UPTIME -ge $RESTART_INTERVAL ]; then
            log_message "⏰ 12-hour restart interval reached (uptime: $UPTIME seconds)"
            stop_server
            log_message "🔄 Restarting server..."
            sleep 2
            break  # Break inner loop to restart server
        fi
        
        # Check server health every 30 seconds
        sleep 30
    done
done

