@echo off
chcp 65001 > nul
echo ========================================================
echo   ToeicMate - Database Setup & Seeding Script
echo ========================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Creating SQLite Database with Prisma...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to push prisma database schema.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Seeding initial questions, vocab cards, and phrases...
call npx tsx prisma/seed.ts
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to seed database.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo   Setup completed successfully!
echo   You can now run start.bat to launch ToeicMate.
echo ========================================================
echo.
pause
