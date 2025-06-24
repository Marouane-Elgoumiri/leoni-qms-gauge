#!/bin/bash

# LEONI Calibration Alert System - API Startup Script
# This script starts the Flask API for the calibration management system

echo "🚀 Starting LEONI Calibration Alert API..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📋 Installing dependencies..."
pip install -r requirements_api.txt

# Check if the Alert System exists and dependencies are available
echo "🔧 Checking Alert System dependencies..."
if [ -d "Calibration Alert System/Alert_System_Automation" ]; then
    cd "Calibration Alert System/Alert_System_Automation"
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
    cd ../..
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Set environment variables (optional)
export FLASK_ENV=development
export FLASK_DEBUG=1

# Start the API
echo "🌐 Starting Flask API on http://localhost:5000..."
echo "📊 API endpoints will be available at:"
echo "   - GET  /api/health - Health check"
echo "   - GET  /api/equipment - Get equipment data"
echo "   - GET  /api/alerts - Get current alerts"
echo "   - GET  /api/statistics - Get calibration statistics"
echo "   - POST /api/upload - Upload Excel file"
echo "   - POST /api/send-alerts - Send email alerts"
echo "   - GET/POST /api/config - Manage configuration"
echo ""
echo "🔧 To test the API, open: http://localhost:5000/api/health"
echo "📱 To use the web interface, open: calibration-management.html"
echo ""

python3 calibration_api.py
