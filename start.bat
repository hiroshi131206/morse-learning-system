@echo off
echo ========================================
echo Morse Learning System - Startup Script
echo ========================================
echo.

REM バックエンドのセットアップ確認
echo [1/4] Checking backend dependencies...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM フロントエンドのセットアップ確認
echo.
echo [2/4] Checking frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

REM バックエンドを起動
echo.
echo [3/4] Starting backend server...
cd ..\backend
start "Morse Learning System - Backend" cmd /k "venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

REM 少し待機
timeout /t 3 /nobreak > nul

REM フロントエンドを起動
echo.
echo [4/4] Starting frontend server...
cd ..\frontend
start "Morse Learning System - Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Startup Complete!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo.
echo Press any key to open browser...
pause > nul

start http://localhost:5173

echo.
echo To stop the servers, close the terminal windows.
echo.
