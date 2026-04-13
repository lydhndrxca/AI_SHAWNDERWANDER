@echo off
title WORM MAN — Earth's Least Mighty Hero
color 0C

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          W O R M   M A N   N P C             ║
echo  ║       Earth's Least Mighty Hero              ║
echo  ║       "You just got WORMED."                 ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ─── Check Python ───
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+ first.
    pause
    exit /b 1
)

:: ─── Check ffmpeg ───
where ffmpeg >nul 2>&1
if errorlevel 1 (
    echo [WARNING] ffmpeg not found.
    echo   Worm Man's face animation needs ffmpeg.
    echo   Install it: winget install ffmpeg
    echo   Or download from: https://ffmpeg.org/download.html
    echo   Continuing without it — you'll get audio-only responses.
    echo.
)

:: ─── Check Ollama ───
where ollama >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Ollama not found.
    echo   Worm Man's brain needs Ollama running.
    echo   Install from: https://ollama.ai
    echo.
) else (
    echo [OK] Ollama found. Make sure it's running: ollama serve
)

:: ─── Install Python deps ───
cd /d "%~dp0server"

if not exist ".venv" (
    echo.
    echo [SETUP] Creating virtual environment...
    python -m venv .venv
)

echo [SETUP] Activating venv...
call .venv\Scripts\activate.bat

echo [SETUP] Installing dependencies (first run may take a minute)...
pip install -r requirements.txt -q 2>nul

:: ─── Download Kokoro models if missing ───
if not exist "kokoro-v1.0.onnx" (
    echo.
    echo [SETUP] Downloading Kokoro TTS model (~80MB)...
    python -c "import kokoro_onnx; print('Kokoro model ready')" 2>nul
    if errorlevel 1 (
        echo [NOTE] Kokoro model will download on first use.
    )
)

:: ─── Fix CUDA DLLs for Whisper GPU ───
if exist ".venv\Lib\site-packages\nvidia\cublas\bin\cublas64_12.dll" (
    if not exist ".venv\Lib\site-packages\ctranslate2\cublas64_12.dll" (
        echo [SETUP] Copying CUDA DLLs for Whisper GPU support...
        copy ".venv\Lib\site-packages\nvidia\cublas\bin\cublas64_12.dll" ".venv\Lib\site-packages\ctranslate2\" >nul
        copy ".venv\Lib\site-packages\nvidia\cublas\bin\cublasLt64_12.dll" ".venv\Lib\site-packages\ctranslate2\" >nul
    )
)

:: ─── Kill existing process on port 8425 ───
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8425 ^| findstr LISTENING 2^>nul') do (
    echo Stopping existing process on port 8425 (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: ─── Start server ───
echo.
echo ============================================
echo   Starting Worm Man on http://localhost:8425
echo ============================================
echo.

start "" "http://localhost:8425"
python main.py
