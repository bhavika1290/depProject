#!/bin/bash

# IIT Ropar Admissions Portal - Installation Script
# This script will help you set up the project

echo "=========================================="
echo "IIT Ropar PhD Admissions Portal"
echo "Installation Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js is installed: $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
else
    echo "✅ npm is installed: $(npm --version)"
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not detected."
    echo "Please install MongoDB or use MongoDB Atlas (cloud)"
else
    echo "✅ MongoDB is installed"
fi

echo ""
echo "=========================================="
echo "Step 1: Installing Backend Dependencies"
echo "=========================================="
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "Step 2: Installing Frontend Dependencies"
echo "=========================================="
cd client
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "=========================================="
echo "Step 3: Environment Configuration"
echo "=========================================="

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your configuration:"
    echo "   - Set your MongoDB URI"
    echo "   - Set a strong JWT_SECRET"
    echo "   - Configure email settings"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "=========================================="
echo "Step 4: Creating Upload Directories"
echo "=========================================="
mkdir -p server/uploads/profiles
mkdir -p server/uploads/applications
mkdir -p server/uploads/excel
echo "✅ Upload directories created"

echo ""
echo "=========================================="
echo "Installation Complete! 🎉"
echo "=========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure .env file:"
echo "   nano .env"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   sudo systemctl start mongod"
echo ""
echo "3. Run the application:"
echo "   npm run dev"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
echo "For quick start, see QUICKSTART.md"
echo ""
