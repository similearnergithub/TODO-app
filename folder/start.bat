@echo off
echo ========================================
echo   ToDo List Application - Quick Start
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker not found! Installing dependencies manually...
    echo.
    echo Installing Backend Dependencies...
    cd server
    call npm install
    cd ..
    echo.
    echo Installing Frontend Dependencies...
    cd client
    call npm install
    cd ..
    echo.
    echo Next steps:
    echo 1. Update server\.env with GROQ_API_KEY
    echo 2. Run: npm run dev (in server folder)
    echo 3. In another terminal: npm run dev (in client folder)
    pause
) else (
    echo Docker found! Starting application with Docker Compose...
    echo.
    echo Make sure to update server\.env with your GROQ_API_KEY first!
    echo.
    pause
    docker-compose up --build
)
