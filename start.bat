@echo off
chcp 65001 > nul
echo ========================================================
echo   Launching ToeicMate Web Application
echo ========================================================
echo.
echo [ เครื่องนี้เปิดที่ ]: http://localhost:3000
echo [ มือถือ/เครื่องอื่นใน Wi-Fi เดียวกัน ]: http://10.10.10.207:3000
echo.
echo Demo Account: seed@toeicmate.app / password123
echo ========================================================
echo.
echo Starting development server...

set PATH=C:\Program Files\nodejs;%PATH%

start "" http://localhost:3000
call npm run dev
pause
