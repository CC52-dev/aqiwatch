#!/usr/bin/env python3
"""
AQI Server Monitor
Runs server.py with automatic restart every 12 hours or on errors
"""
import os
import sys
import time
import subprocess
import signal
from datetime import datetime
from pathlib import Path

# Configuration
RESTART_INTERVAL = 43200  # 12 hours in seconds
SCRIPT_DIR = Path(__file__).parent
LOG_DIR = SCRIPT_DIR / "logs"
SERVER_SCRIPT = SCRIPT_DIR / "server.py"

# Create logs directory
LOG_DIR.mkdir(exist_ok=True)

# Log file
LOG_FILE = LOG_DIR / f"server_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

def log_message(message):
    """Log a message to both console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}"
    
    # Print to console with error handling for encoding issues
    try:
        print(log_line)
    except UnicodeEncodeError:
        # Fallback: print ASCII-only version
        print(log_line.encode('ascii', errors='replace').decode('ascii'))
    
    # Write to file with UTF-8 encoding
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_line + '\n')

def start_server():
    """Start the server process"""
    log_message("🚀 Starting AQI server...")
    
    # Start server with output redirected to log file
    stdout_log = LOG_DIR / "server_stdout.log"
    stderr_log = LOG_DIR / "server_stderr.log"
    
    process = subprocess.Popen(
        [sys.executable, str(SERVER_SCRIPT)],
        stdout=open(stdout_log, 'a', encoding='utf-8'),
        stderr=open(stderr_log, 'a', encoding='utf-8'),
        cwd=SCRIPT_DIR
    )
    
    log_message(f"✅ Server started with PID: {process.pid}")
    return process

def stop_server(process):
    """Stop the server process"""
    if process and process.poll() is None:
        log_message(f"🛑 Stopping server (PID: {process.pid})...")
        try:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                log_message("⚠️  Force killing server...")
                process.kill()
                process.wait()
            log_message("✅ Server stopped")
        except Exception as e:
            log_message(f"⚠️  Error stopping server: {e}")

def is_server_running(process):
    """Check if server is still running"""
    return process and process.poll() is None

def main():
    """Main monitoring loop"""
    log_message("=" * 60)
    log_message("🌬️  AQI Server Monitor Started")
    log_message("=" * 60)
    log_message("📊 Configuration:")
    log_message("   - Restart interval: 12 hours")
    log_message("   - Auto-restart on crash: Enabled")
    log_message(f"   - Log file: {LOG_FILE}")
    log_message("")
    
    restart_count = 0
    process = None
    
    # Handle graceful shutdown
    def signal_handler(sig, frame):
        log_message("📛 Received termination signal")
        stop_server(process)
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        while True:
            restart_count += 1
            
            if restart_count > 1:
                log_message(f"🔄 Restart #{restart_count}")
            
            # Start the server
            process = start_server()
            start_time = time.time()
            
            # Monitor the server
            while True:
                # Check if server is still running
                if not is_server_running(process):
                    uptime = int(time.time() - start_time)
                    log_message(f"❌ Server crashed after {uptime} seconds!")
                    log_message("🔄 Restarting in 5 seconds...")
                    time.sleep(5)
                    break  # Break inner loop to restart server
                
                # Check if it's time for scheduled restart (12 hours)
                uptime = int(time.time() - start_time)
                
                if uptime >= RESTART_INTERVAL:
                    log_message(f"⏰ 12-hour restart interval reached (uptime: {uptime} seconds)")
                    stop_server(process)
                    log_message("🔄 Restarting server...")
                    time.sleep(2)
                    break  # Break inner loop to restart server
                
                # Check server health every 30 seconds
                time.sleep(30)
                
    except KeyboardInterrupt:
        log_message("📛 Keyboard interrupt received")
        stop_server(process)
    except Exception as e:
        log_message(f"❌ Fatal error: {e}")
        stop_server(process)
        raise

if __name__ == "__main__":
    main()

