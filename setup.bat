@echo off
REM Health Tracker - Quick Setup Script (Windows)

echo ======================================
echo Health Tracker - Quick Setup
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [!] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%A in ('node --version') do set NODE_VERSION=%%A
for /f "tokens=*" %%A in ('npm --version') do set NPM_VERSION=%%A

echo [+] Node.js version: %NODE_VERSION%
echo [+] npm version: %NPM_VERSION%

REM Backend Setup
echo.
echo ======================================
echo Setting up Backend...
echo ======================================

cd backend

if not exist "config.env" (
    echo [!] config.env not found. Creating template...
    (
        echo ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/health-tracker?retryWrites=true^&w=majority
        echo JWT_SECRET=change-this-to-a-strong-secret-key
        echo PORT=3000
    ) > config.env
    echo [+] config.env created. Please update with your MongoDB URI and JWT secret.
)

echo [*] Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [-] Failed to install backend dependencies
    exit /b 1
)

echo [+] Backend dependencies installed successfully

cd ..

REM Frontend Setup
echo.
echo ======================================
echo Setting up Frontend...
echo ======================================

cd frontend

if not exist ".env.local" (
    echo [!] .env.local not found. Creating template...
    (
        echo VITE_API_URL=http://localhost:3000/api
    ) > .env.local
    echo [+] .env.local created
)

echo [*] Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [-] Failed to install frontend dependencies
    exit /b 1
)

echo [+] Frontend dependencies installed successfully

cd ..

REM Done
echo.
echo ======================================
echo [+] Setup Complete!
echo ======================================
echo.
echo Next steps:
echo.
echo 1. Update backend/config.env with your MongoDB Atlas URI
echo 2. Start backend:
echo    cd backend ^&^& npm run dev
echo.
echo 3. In another terminal, start frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
pause
