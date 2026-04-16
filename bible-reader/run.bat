@echo off
echo Opening Bible Reader...
start "" "http://localhost:8091"
cd /d "%~dp0"
python -m http.server 8091
