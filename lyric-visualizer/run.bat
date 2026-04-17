@echo off
echo Opening Lyric Visualizer...
start "" "http://localhost:8090"
cd /d "%~dp0"
python -m http.server 8090
