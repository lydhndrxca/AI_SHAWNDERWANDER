@echo off
title Corporate Golf
echo ============================================
echo   CORPORATE GOLF — Pebble Beach
echo   Windows 95 Retro Golf Experience
echo ============================================
echo.

cd /d "%~dp0server"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

:: Kill anything already on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo Stopping existing process on port 3000 (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo Starting server on http://localhost:3000
echo.
echo   Game:   http://localhost:3000
echo   Editor: http://localhost:3000/editor/
echo.
echo Press Ctrl+C to stop the server.
echo ============================================
echo.

start "" http://localhost:3000
start "" http://localhost:3000/editor/

node index.js
