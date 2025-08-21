@echo off
chcp 65001 >nul
echo 🍳 Welcome to FlavorAI Setup! 🍳
echo ==================================
echo.

REM 
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo    Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM 
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available
echo.

REM 
echo 🚀 Starting PostgreSQL database...
docker-compose up -d postgres

REM 
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo ✅ Database is running
echo.

REM 
echo 🔧 Setting up backend...
cd backend

REM 
if not exist .env (
    copy env.example .env
    echo 📝 Created .env file - please edit with your database credentials
    echo    Default database credentials:
    echo    - Database: flavorai
    echo    - Username: flavorai_user
    echo    - Password: flavorai_password
    echo    - Port: 5432
    echo.
)

REM 
echo 📦 Installing backend dependencies...
call npm install

REM 
echo 🗄️ Generating Prisma client...
call npm run db:generate

REM 
echo 🗄️ Setting up database schema...
call npm run db:push

echo ✅ Backend setup complete!
echo.

REM 
echo 🎨 Setting up frontend...
cd ..\frontend

REM 
echo 📦 Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete!
echo.

REM 
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
    echo 📝 Created frontend .env.local file
)

echo.
echo 🎉 Setup complete! 🎉
echo ======================
echo.
echo To start the application:
echo.
echo 1. Start the backend:
echo    cd backend
echo    npm run start:dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    Database Admin: http://localhost:8080
echo.
echo Happy cooking! 🍳✨
pause
