# Quick Start Guide - IIT Ropar Admissions Portal

Get the application running in 5 minutes!

## Prerequisites
- Node.js (v14+)
- MongoDB
- Gmail account (for email functionality)

## 1. Install Dependencies (2 minutes)

```bash
# Backend
npm install

# Frontend
cd client && npm install && cd ..
```

## 2. Setup Environment (1 minute)

Create `.env` file in root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/iit_ropar_admissions
JWT_SECRET=change_this_to_random_32_character_string
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

## 3. Start MongoDB (if not running)

```bash
# Linux/Mac
sudo systemctl start mongod

# Mac with Homebrew
brew services start mongodb-community

# Windows (as Administrator)
net start MongoDB
```

## 4. Run the Application (1 minute)

```bash
npm run dev
```

Application will open at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 5. Create Admin User

Open MongoDB shell:
```bash
mongo
```

Run these commands:
```javascript
use iit_ropar_admissions

db.users.insertOne({
  email: "admin@iitrpr.ac.in",
  password: "$2a$10$XQIqG5LgNYQHQVYGJWHo3eHIYOoFLLBjHJF5P4xqR7xWZHYWFXYYa",
  role: "superadmin",
  isVerified: true,
  createdAt: new Date()
})

exit
```

**Login Credentials:**
- Email: admin@iitrpr.ac.in
- Password: admin123

**⚠️ Change password immediately after first login!**

## Common Issues

### MongoDB not connecting?
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start it if not running
sudo systemctl start mongod
```

### Port 5000 in use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env to 5001
```

### Emails not sending?
1. Enable 2-Step Verification in Gmail
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use that password in EMAIL_PASSWORD

## Test the Application

1. **Student Flow:**
   - Register at http://localhost:3000/register
   - Verify OTP from email
   - Complete profile
   - Browse positions
   - Submit application

2. **Admin Flow:**
   - Login at http://localhost:3000/login
   - Create admission cycle
   - Add offerings
   - View applications
   - Send bulk emails

## Default Template Seeds

After login as admin, seed default templates:

```bash
# Run seed script (if available)
npm run seed

# Or create manually in Admin > Templates
```

## Project Structure

```
iit-ropar-admissions/
├── server/              # Backend (Node.js + Express)
│   ├── controllers/     # Business logic
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & validation
│   └── utils/          # Helper functions
├── client/             # Frontend (React)
│   └── src/
│       ├── pages/      # Page components
│       ├── components/ # Reusable components
│       └── context/    # State management
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Key API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login
- POST /api/auth/verify-otp - Verify email

### Applications
- GET /api/applications - Get all applications (admin)
- POST /api/applications - Submit application (student)

### Admission Cycles
- GET /api/admission-cycles - Get all cycles
- POST /api/admission-cycles - Create cycle (admin)

### Offerings
- GET /api/offerings/open - Get open positions
- POST /api/offerings - Create position (admin)

## Next Steps

1. ✅ Application is running
2. 📝 Create your first admission cycle
3. 📝 Add department offerings
4. 📝 Configure email templates
5. 🧪 Test student registration and application flow
6. 🚀 Deploy to production

## Need Help?

- **Full Setup Guide**: See SETUP_GUIDE.md
- **Documentation**: See README.md
- **Support**: coapcell@iitrpr.ac.in

---

**You're all set! Start exploring the application.** 🎉
