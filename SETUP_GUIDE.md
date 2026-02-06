# IIT Ropar PhD Admissions Portal - Complete Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Email Configuration](#email-configuration)
5. [Running the Application](#running-the-application)
6. [Creating First Admin User](#creating-first-admin-user)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Required Software
- **Node.js**: v14.0.0 or higher (v18 recommended)
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.4 or higher
- **Git**: Latest version

### Operating System
- Windows 10/11
- macOS 10.14+
- Linux (Ubuntu 20.04+ recommended)

### Hardware Requirements
- RAM: 4GB minimum, 8GB recommended
- Disk Space: 2GB free space
- Internet connection for package installation

## Installation Steps

### Step 1: Install Node.js

**Windows/Mac:**
1. Download from https://nodejs.org/
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/download-center/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify MongoDB installation:
```bash
mongo --version
# or
mongod --version
```

### Step 3: Clone or Extract Project Files

```bash
# If using git
git clone <repository-url>
cd iit-ropar-admissions

# Or extract the ZIP file and navigate to the folder
cd iit-ropar-admissions
```

### Step 4: Install Project Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

This may take 5-10 minutes depending on your internet speed.

## Database Setup

### Option 1: Local MongoDB

1. Ensure MongoDB is running:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
net start MongoDB  # Windows (as Administrator)
```

2. Create database (MongoDB will create it automatically on first use):
```bash
mongo
> use iit_ropar_admissions
> exit
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Click "Connect" > "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Use this connection string in your .env file

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iit_ropar_admissions?retryWrites=true&w=majority
```

## Email Configuration

### Setup Gmail for Sending Emails

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Enter name: "IIT Ropar Admissions"
   - Click Generate
   - Copy the 16-character password

3. **Update .env File**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=IIT Ropar Admissions <noreply@iitrpr.ac.in>
```

### Alternative: Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` file and configure all variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/iit_ropar_admissions

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=IIT Ropar Admissions <noreply@iitrpr.ac.in>

# Frontend URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# OTP Configuration
OTP_EXPIRE_MINUTES=10
```

### Generate Strong JWT Secret

**Method 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Method 2: Online Generator**
- Visit https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" section

## Running the Application

### Development Mode (Recommended for Testing)

**Option 1: Run Both Backend and Frontend Together**
```bash
npm run dev
```

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
cd ..
```

2. Start the server:
```bash
NODE_ENV=production npm start
```

## Creating First Admin User

### Method 1: Using MongoDB Shell

```bash
mongo
> use iit_ropar_admissions
> db.users.insertOne({
  email: "admin@iitrpr.ac.in",
  password: "$2a$10$XQIqG5LgNYQHQVYGJWHo3eHIYOoFLLBjHJF5P4xqR7xWZHYWFXYYa",
  role: "superadmin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Default password: `admin123` (Change immediately after first login!)

### Method 2: Using Postman/API

1. Start the server
2. Send POST request to `http://localhost:5000/api/auth/register`
```json
{
  "email": "admin@iitrpr.ac.in",
  "password": "your_secure_password",
  "role": "superadmin"
}
```

3. Check email for OTP and verify using POST `http://localhost:5000/api/auth/verify-otp`
```json
{
  "email": "admin@iitrpr.ac.in",
  "otp": "123456"
}
```

### Change Default Password

After first login, immediately change the password:
1. Login to the portal
2. Go to Profile
3. Update password

## Testing the Application

### Test User Registration

1. Go to http://localhost:3000/register
2. Enter email and password
3. Check email for OTP
4. Verify OTP
5. Login with credentials

### Test Admin Features

1. Login as admin
2. Navigate to Dashboard
3. Create admission cycle
4. Add offerings
5. Test bulk email upload

### Test Student Features

1. Login as student
2. Complete profile
3. Browse open positions
4. Submit application

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change PORT in .env file
PORT=5001
```

### Issue: npm install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Try with --legacy-peer-deps if needed
npm install --legacy-peer-deps
```

### Issue: Email Not Sending

**Solutions:**
1. Verify Gmail app password is correct
2. Check 2-Step Verification is enabled
3. Ensure "Less secure app access" is OFF
4. Try different email provider
5. Check firewall/antivirus blocking port 587

### Issue: Frontend Not Loading

**Solution:**
```bash
# Clear browser cache
# Check browser console for errors
# Verify proxy setting in client/package.json
# Restart development server
```

### Issue: File Upload Fails

**Solution:**
```bash
# Check uploads directory exists and has write permissions
mkdir -p server/uploads
chmod 755 server/uploads

# Check MAX_FILE_SIZE in .env
MAX_FILE_SIZE=5242880
```

### Issue: Database Connection Timeout

**Solution:**
```bash
# For MongoDB Atlas:
# 1. Whitelist your IP address
# 2. Check internet connection
# 3. Verify connection string

# For Local MongoDB:
# 1. Check MongoDB is running
# 2. Verify MONGODB_URI in .env
```

## Useful Commands

```bash
# View MongoDB logs
tail -f /var/log/mongodb/mongod.log  # Linux
tail -f /usr/local/var/log/mongodb/mongo.log  # Mac

# Check running processes
ps aux | grep node
ps aux | grep mongod

# Stop all node processes
pkill node

# MongoDB shell commands
mongo
> show dbs
> use iit_ropar_admissions
> show collections
> db.users.find()
> exit
```

## Next Steps

1. ✅ Complete installation
2. ✅ Create admin user
3. ✅ Login to admin portal
4. 📝 Create admission cycle
5. 📝 Add department offerings
6. 📝 Create email templates
7. 📝 Test complete workflow
8. 🚀 Deploy to production

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions.

## Support

For issues and questions:
- Email: coapcell@iitrpr.ac.in
- GitHub Issues: [Create an issue]
- Documentation: [Wiki]

## Security Checklist

Before going to production:
- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure cookie settings
- [ ] Configure CORS properly
- [ ] Set rate limiting
- [ ] Enable MongoDB authentication
- [ ] Regular backups configured
- [ ] Error logging configured
- [ ] Security headers added

---

**Installation complete! 🎉**

Start the application with `npm run dev` and access it at http://localhost:3000
