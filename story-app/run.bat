@echo off
echo Opening Story Sherpa...
start "" "http://localhost:8093"
cd /d "%~dp0"
python -m http.server 8093
