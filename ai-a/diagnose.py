#!/usr/bin/env python3
"""
Diagnostic script to check if the server can start properly
Run this to debug container issues
"""
import os
import sys
from pathlib import Path

print("=" * 60)
print("AQI Server Diagnostic Check")
print("=" * 60)
print()

# Check 1: Python version
print("1. Python Version:")
print(f"   {sys.version}")
print(f"   Executable: {sys.executable}")
print()

# Check 2: Current directory
print("2. Current Directory:")
print(f"   {os.getcwd()}")
print()

# Check 3: Check required files
print("3. Required Files:")
required_files = [
    'server.py',
    'aqi_predictor.py',
    'monitor.py',
    'improved_aqi_model.h5',
    'requirements.txt'
]

for file in required_files:
    exists = os.path.exists(file)
    size = os.path.getsize(file) if exists else 0
    status = "✓" if exists else "✗"
    print(f"   [{status}] {file:30} ({size:,} bytes)" if exists else f"   [{status}] {file:30} MISSING")
print()

# Check 4: Try importing dependencies
print("4. Python Dependencies:")
dependencies = [
    ('flask', 'Flask'),
    ('numpy', 'NumPy'),
    ('tensorflow', 'TensorFlow'),
    ('sklearn', 'scikit-learn'),
    ('requests', 'Requests'),
]

for module, name in dependencies:
    try:
        mod = __import__(module)
        version = getattr(mod, '__version__', 'unknown')
        print(f"   [✓] {name:20} version {version}")
    except ImportError as e:
        print(f"   [✗] {name:20} NOT INSTALLED - {e}")
print()

# Check 5: Try loading the predictor
print("5. AQI Predictor Test:")
try:
    from aqi_predictor import AQIPredictor
    print("   [✓] AQIPredictor imported successfully")
    
    predictor = AQIPredictor()
    print("   [✓] AQIPredictor instance created")
    
    predictor.load_model('improved_aqi_model.h5')
    print("   [✓] Model loaded successfully")
    
except FileNotFoundError as e:
    print(f"   [✗] Model file not found: {e}")
except Exception as e:
    print(f"   [✗] Error: {e}")
    import traceback
    traceback.print_exc()
print()

# Check 6: Environment variables
print("6. Environment Variables:")
env_vars = [
    'PYTHONUNBUFFERED',
    'TF_CPP_MIN_LOG_LEVEL',
    'PYTHONIOENCODING',
    'LANG'
]

for var in env_vars:
    value = os.environ.get(var, 'NOT SET')
    print(f"   {var:25} = {value}")
print()

# Check 7: Port availability
print("7. Port Check:")
import socket
try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(('0.0.0.0', 5000))
    sock.close()
    print("   [✓] Port 5000 is available")
except OSError as e:
    print(f"   [✗] Port 5000 is not available: {e}")
print()

# Summary
print("=" * 60)
print("Diagnostic Complete")
print("=" * 60)
print()
print("If all checks pass, the server should start successfully.")
print("Run: python server.py")
print()

