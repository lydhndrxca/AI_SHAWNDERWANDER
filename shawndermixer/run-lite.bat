@echo off
echo ============================================
echo    SHAWNDERMIXER (Lite — no stem splitting)
echo ============================================
echo.
echo Starting on port 8095 (no Python deps required)...
echo Stem splitting will be disabled.
echo.
start "" "http://localhost:8095"
cd /d "%~dp0"
python -m http.server 8095
