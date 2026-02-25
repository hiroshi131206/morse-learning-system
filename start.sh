#!/bin/bash

echo "========================================"
echo "Morse Learning System - Startup Script"
echo "========================================"
echo ""

# カラー定義
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# バックエンドのセットアップ確認
echo "[1/4] Checking backend dependencies..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install backend dependencies${NC}"
    exit 1
fi

# フロントエンドのセットアップ確認
echo ""
echo "[2/4] Checking frontend dependencies..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi

# バックエンドを起動（バックグラウンド）
echo ""
echo "[3/4] Starting backend server..."
cd ../backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload > /tmp/morse-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"

# 少し待機
sleep 3

# フロントエンドを起動（バックグラウンド）
echo ""
echo "[4/4] Starting frontend server..."
cd ../frontend
npm run dev > /tmp/morse-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"

# 待機
sleep 2

echo ""
echo "========================================"
echo "Startup Complete!"
echo "========================================"
echo ""
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}Backend API:${NC} http://localhost:8001"
echo -e "${GREEN}API Docs:${NC} http://localhost:8001/docs"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  Backend: /tmp/morse-backend.log"
echo "  Frontend: /tmp/morse-frontend.log"
echo ""
echo -e "${RED}To stop the servers, run:${NC}"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# ブラウザを開く（macOSの場合）
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5173
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:5173 2>/dev/null || echo "Please open http://localhost:5173 in your browser"
fi

echo "Press Ctrl+C to stop monitoring..."
echo ""

# プロセスの監視
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# ログをtail
tail -f /tmp/morse-backend.log /tmp/morse-frontend.log
