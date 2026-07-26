@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo MyTools - Developer toolkit, starting (no-cache)...
echo Visit http://127.0.0.1:8766/
echo Press Ctrl+C to stop
python serve.py
pause