#!/bin/bash

# Development starter script for Cuvee Web App
# Runs both Node.js API server and React dev server

echo "🚀 Starting Cuvée Web App Development Environment"
echo ""
echo "This will start:"
echo "  1. Node.js API Server on http://localhost:8080"
echo "  2. React Dev Server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $API_PID $DEV_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Node.js API server in background
echo "🟢 Starting Node.js API Server..."
node server.js > /dev/null 2>&1 &
API_PID=$!

# Wait a moment for API server to start
sleep 2

# Check if API server started successfully
if ! kill -0 $API_PID 2>/dev/null; then
    echo "❌ Failed to start API server"
    exit 1
fi

echo "✅ API Server running on http://localhost:8080"
echo ""

# Start npm dev server
echo "⚛️  Starting React Dev Server..."
npm run dev &
DEV_PID=$!

# Wait for both processes
wait
