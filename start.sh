#!/bin/bash
# FindMyHome Quick Startup Script

echo "🚀 Starting FindMyHome..."

# 1. Check & start PostgreSQL if not running
if ! lsof -i :5432 > /dev/null 2>&1; then
    echo "📦 Starting PostgreSQL..."
    brew services start postgresql@17
    sleep 2
fi

# 2. Stop any existing processes on 8080 and 5173
lsof -ti :8080 | xargs kill -9 > /dev/null 2>&1 || true
lsof -ti :5173 | xargs kill -9 > /dev/null 2>&1 || true

# 3. Start Backend in background
echo "☕ Starting Spring Boot backend on port 8080..."
cd "$(dirname "$0")/backend"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
/opt/homebrew/bin/mvn spring-boot:run > /dev/null 2>&1 &
BACKEND_PID=$!

# 4. Start Frontend in background
echo "⚛️  Starting React frontend on port 5173..."
cd "$(dirname "$0")/frontend"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✅ FindMyHome is launching!"
echo "🌐 Frontend URL: http://localhost:5173"
echo "🔌 Backend API:  http://localhost:8080"
echo ""
echo "Accounts to show your mentor:"
echo "----------------------------------------"
echo "🏠 OWNER ACCOUNT:"
echo "   Email:    rajesh.owner@example.com"
echo "   Password: password123"
echo ""
echo "👤 TENANT ACCOUNT:"
echo "   Email:    aarav.tenant@example.com"
echo "   Password: password123"
echo "----------------------------------------"
echo "Press Ctrl+C or run 'pkill -f spring-boot' and 'pkill -f vite' to stop."
