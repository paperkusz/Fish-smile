#!/bin/bash

# Fish-Smile Development Startup Script
# This script starts both the API server and the frontend

echo "🐟 Fish-Smile Development Environment"
echo "====================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if API dependencies are installed
if [ ! -d "api/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    cd api
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo "✅ Python virtual environment found"
fi

# Start API server in background
echo "🚀 Starting API server..."
cd api
source venv/bin/activate
python app.py &
API_PID=$!
cd ..

# Wait for API to start
echo "⏳ Waiting for API server to start..."
sleep 3

# Check if API is running
if curl -s http://localhost:5000/ > /dev/null; then
    echo "✅ API server is running at http://localhost:5000"
else
    echo "❌ API server failed to start"
    kill $API_PID 2>/dev/null
    exit 1
fi

# Start frontend server
echo "🌐 Starting frontend server..."
python3 -m http.server 8000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

echo "✅ Frontend server is running at http://localhost:8000"
echo ""
echo "🎯 Open your browser and go to:"
echo "   Frontend: http://localhost:8000"
echo "   API Docs: http://localhost:5000"
echo ""
echo "📊 Available dashboards:"
echo "   • Pond 1: http://localhost:8000/Fish-Smile01.html"
echo "   • Pond 2: http://localhost:8000/Fish-Smile02.html"
echo "   • Pond 3: http://localhost:8000/Fish-Smile03.html"
echo "   • Pond 4: http://localhost:8000/Fish-Smile04.html"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait