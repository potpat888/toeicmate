@echo off
chcp 65001 > nul
echo ========================================================
echo   ToeicMate - แชร์ลิงก์ออนไลน์สำหรับเล่นนอกบ้าน (4G/5G)
echo ========================================================
echo.
echo * หมายเหตุ: ต้องเปิด start.bat รันเว็บแอปค้างไว้ก่อนนะครับ
echo.
echo กำลังสร้างลิงก์อินเทอร์เน็ตสาธารณะ (Public URL)...
echo.

set PATH=C:\Program Files\nodejs;%PATH%

call npx --yes localtunnel --port 3000
pause
