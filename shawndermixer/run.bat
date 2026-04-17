@echo off
echo ============================================
echo    SHAWNDERMIXER
echo    Web-Based Audio Mixing Software
echo ============================================
echo.

cd /d "%~dp0"

:: ─── Check Python ───
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+ and add to PATH.
    pause
    exit /b 1
)

:: ─── Create venv if it doesn't exist ───
if not exist "server\.venv" goto :setup_venv
goto :check_deps

:setup_venv
echo [First Run] Setting up stem separation backend...
echo This installs Demucs + PyTorch. It may take several minutes.
echo.
echo To skip and use the mixer without stems, close this window
echo and run "run-lite.bat" instead.
echo.
python -m venv server\.venv
if errorlevel 1 goto :venv_failed
goto :check_deps

:venv_failed
echo [ERROR] Failed to create virtual environment.
echo Falling back to lite mode...
goto :lite

:check_deps
:: ─── Activate venv ───
call server\.venv\Scripts\activate.bat

:: ─── Install dependencies if needed ───
pip show fastapi >nul 2>&1
if errorlevel 1 goto :install_deps
goto :start_server

:install_deps
echo [Setup] Installing dependencies: FastAPI, Demucs, PyTorch...
echo This may take a few minutes on first run...
echo.
pip install -r server\requirements.txt
if errorlevel 1 goto :install_failed
echo.
echo [Setup] Install complete!
echo.
goto :start_server

:install_failed
echo.
echo [ERROR] Dependency install failed.
echo Falling back to lite mode...
echo You can re-run this bat to retry, or use run-lite.bat
echo.
goto :lite

:start_server
echo.
echo  Keyboard shortcuts:
echo    Space      Play / Pause
echo    Ctrl+S     Save project
echo    Ctrl+O     Open project
echo    Ctrl+I     Import audio
echo    Ctrl+E     Export WAV
echo    R          Toggle automation recording
echo    L          Toggle loop
echo    +/-        Zoom in/out
echo    Home/End   Jump to start/end
echo.
echo  Stem Splitting: Click "Split Stems" in toolbar
echo  Powered by Meta Demucs HTDemucs v4 on GPU
echo.
echo  Starting server on http://localhost:8095 ...
echo.

start "" "http://localhost:8095"
python server\stem_server.py
echo.
echo [Server exited]
pause
exit /b 0

:lite
echo.
echo ============================================
echo    Starting in LITE MODE - no stem splitting
echo ============================================
echo.
echo  Stem splitting is disabled.
echo  To enable it, re-run run.bat to retry setup.
echo.
start "" "http://localhost:8095"
python -m http.server 8095
echo.
echo [Server exited]
pause
exit /b 0
