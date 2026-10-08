@echo off
chcp 65001 > nul
echo ========================================================
echo   ToeicMate - กำลังส่งโค้ดทั้งหมด (รวมโฟลเดอร์) ขึ้น GitHub
echo ========================================================
echo.

set PATH=C:\Program Files\Git\cmd;%PATH%

echo กำลังรัน: git push -f origin main ...
echo (หากมีหน้าต่างเด้งถาม ให้คลิก 'Sign in with your browser')
echo.

git push -f origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo   สำเร็จ! โฟลเดอร์ทั้งหมด (app, components, prisma ฯลฯ)
    echo   ขึ้นไปบน GitHub ครบ 100%% แล้ว 🎉
    echo   เข้าไปดูได้ที่: https://github.com/potpat888/toeicmate
) else (
    echo   เกิดข้อผิดพลาด หรือหน้าต่างยืนยันถูกปิด
)
echo ========================================================
echo.
pause
