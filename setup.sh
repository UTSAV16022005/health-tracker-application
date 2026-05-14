#!/bin/bash

# Health Tracker - Quick Setup Script
# This script automates the setup process for both backend and frontend

echo "======================================"
echo "Health Tracker - Quick Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Backend Setup
echo ""
echo "======================================"
echo "Setting up Backend..."
echo "======================================"

cd backend

if [ ! -f "config.env" ]; then
    echo "⚠️  config.env not found. Creating template..."
    cat > config.env << 'EOF'
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/health-tracker?retryWrites=true&w=majority
JWT_SECRET=change-this-to-a-strong-secret-key
PORT=3000
EOF
    echo "✅ config.env created. Please update with your MongoDB URI and JWT secret."
fi

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Frontend Setup
echo ""
echo "======================================"
echo "Setting up Frontend..."
echo "======================================"

cd frontend

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3000/api
EOF
    echo "✅ .env.local created"
fi

echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Done
echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Update backend/config.env with your MongoDB Atlas URI"
echo "2. Start backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In another terminal, start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
