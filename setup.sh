#!/bin/bash

echo "🍳 Welcome to FlavorAI Setup! 🍳"
echo "=================================="
echo ""

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

echo "🚀 Starting PostgreSQL database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "✅ Database is running"
echo ""

echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Created .env file - please edit with your database credentials"
    echo "   Default database credentials:"
    echo "   - Database: flavorai"
    echo "   - Username: flavorai_user"
    echo "   - Password: flavorai_password"
    echo "   - Port: 5432"
    echo ""
fi

echo "📦 Installing backend dependencies..."
npm install

echo "🗄️ Generating Prisma client..."
npm run db:generate

echo "🗄️ Setting up database schema..."
npm run db:push

echo "✅ Backend setup complete!"
echo ""

echo "🎨 Setting up frontend..."
cd ../frontend

echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""
        
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    echo "📝 Created frontend .env.local file"
fi

echo ""
echo "🎉 Setup complete! 🎉"
echo "======================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Database Admin: http://localhost:8080"
echo ""
echo "Happy cooking! 🍳✨"
