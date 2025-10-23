#!/bin/bash
# Git Commit Script - Commits all CPU compatibility fixes to repository

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        Git Commit - CPU Compatibility Fixes                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Working directory: $SCRIPT_DIR"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Checking Git Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git status

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Adding Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Add updated configuration files
git add requirements.txt
echo "✓ Added requirements.txt (CPU-compatible versions)"

git add Dockerfile
echo "✓ Added Dockerfile (with verification)"

# Add setup script
git add setup_server.sh
echo "✓ Added setup_server.sh (automated setup)"

# Add documentation
git add SETUP_README.md
echo "✓ Added SETUP_README.md (complete setup guide)"

git add TENSORFLOW_CPU_FIX.md
echo "✓ Added TENSORFLOW_CPU_FIX.md (TensorFlow troubleshooting)"

git add NUMPY_CPU_FIX.md
echo "✓ Added NUMPY_CPU_FIX.md (NumPy troubleshooting)"

git add TROUBLESHOOTING.md
echo "✓ Added TROUBLESHOOTING.md (updated guide)"

git add FIX_INSTRUCTIONS.txt
echo "✓ Added FIX_INSTRUCTIONS.txt (quick reference)"

git add RUN_THIS_NOW.txt
echo "✓ Added RUN_THIS_NOW.txt (emergency fix)"

git add FIX_TENSORFLOW.sh
echo "✓ Added FIX_TENSORFLOW.sh (TensorFlow fix script)"

# Add this commit script
git add git_commit_changes.sh
echo "✓ Added git_commit_changes.sh (this script)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Creating Commit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git commit -m "Fix: CPU compatibility for TensorFlow and NumPy

- Downgrade TensorFlow from 2.20.0 to 2.15.0 (AVX/AVX2 not required)
- Pin NumPy to < 2.0.0 for CPU compatibility
- Add automated setup script (setup_server.sh)
- Add comprehensive documentation for troubleshooting
- Update Dockerfile with CPU compatibility fixes
- Clean up temporary fix scripts

Fixes 'Illegal instruction (core dumped)' error on CPUs without AVX/AVX2 support.

Files changed:
- requirements.txt: Updated TensorFlow and NumPy versions
- Dockerfile: Added verification step
- setup_server.sh: Complete automated setup
- SETUP_README.md: Comprehensive setup guide
- TENSORFLOW_CPU_FIX.md: TensorFlow troubleshooting
- NUMPY_CPU_FIX.md: NumPy troubleshooting
- TROUBLESHOOTING.md: Updated main guide
- FIX_INSTRUCTIONS.txt: Quick reference
- RUN_THIS_NOW.txt: Emergency fix instructions
- FIX_TENSORFLOW.sh: Automated TensorFlow fix

Tested on: Ubuntu 20.04/22.04 with older CPUs"

echo "✓ Commit created"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Pushing to origin/master"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git push origin master

echo "✓ Changes pushed to origin/master"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              ✓ GIT COMMIT SUCCESSFUL!                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "All CPU compatibility fixes have been committed and pushed."
echo ""
echo "On your server, run:"
echo "  cd ~/aqiwatch/ai-a"
echo "  git pull origin master"
echo "  chmod +x setup_server.sh"
echo "  sudo ./setup_server.sh"
echo ""

