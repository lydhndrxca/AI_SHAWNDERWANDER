@echo off
title WORM MAN — Earth's Least Mighty Hero
cd /d "%~dp0"

echo ========================================
echo   WORM MAN — Earth's Least Mighty Hero
echo   "You just got WORMED."
echo ========================================
echo.

:: Check for node_modules
if not exist "node_modules" (
    echo [SETUP] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo.
)

:: Check Ollama
echo [CHECK] Looking for Ollama...
where ollama >nul 2>&1
if errorlevel 1 (
    echo [WARN] Ollama not found in PATH.
    echo        Install from https://ollama.ai and make sure it's running.
    echo.
) else (
    echo [OK] Ollama found.
)

:: Check for wormman models
echo [CHECK] Looking for Worm Man's brain...
ollama list 2>nul | findstr "wormman" >nul 2>&1
if errorlevel 1 (
    echo [WARN] wormman model not found. Creating it...
    if exist "Modelfile.14b" (
        ollama create wormman:14b -f Modelfile.14b
    )
    echo.
) else (
    echo [OK] Worm Man's brain found.
)

echo [START] Launching Worm Man...
echo.
call npx electron .
