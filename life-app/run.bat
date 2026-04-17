@echo off
echo Opening Pocket...
start "" "http://localhost:8092"
cd /d "%~dp0"
python -m http.server 8092
