# IIT Ropar PhD Admissions Portal

A full-stack web application for managing PhD admissions at IIT Ropar with separate portals for Students, Faculty, and Administrators.

## 🚀 Features

### Public Portal
- Home page with admissions information
- How to Apply guide
- Available openings/positions
- FAQs
- Contact form
- User registration and login

### Student Portal
- Profile management (personal, educational, communication details)
- Browse open positions
- Submit applications
- Track application status
- Receive email notifications

### Admin Portal
- Dashboard with analytics (category-wise, gender-wise applications)
- Manage admission cycles
- Manage offerings/positions
- Review applications
- Bulk email system with Excel upload
- Template management
- User management

### Faculty Portal
- View applications for assigned departments
- Dashboard overview
- Template management

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **File Upload**: Multer
- **Excel Processing**: xlsx
- **PDF Generation**: PDFKit

### Frontend
- **Library**: React.js
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: Formik + Yup
- **Notifications**: React Toastify
- **Icons**: React Icons

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd iit-ropar-admissions
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/iit_ropar_admissions

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=IIT Ropar Admissions <noreply@iitrpr.ac.in>

# Frontend URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# OTP Configuration
OTP_EXPIRE_MINUTES=10
```

### 4. Setup Gmail App Password (for email functionality)

1. Enable 2-Step Verification on your Google Account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this password in EMAIL_PASSWORD in .env file

### 5. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) connection string
```

### 6. Run the Application

```bash
# Development mode (runs both backend and frontend)
npm run dev

# Or run separately:

# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
iit-ropar-admissions/
├── server/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── admission.controller.js
│   │   └── ...
│   ├── models/             # Database models
│   │   ├── User.model.js
│   │   ├── Profile.model.js
│   │   ├── Application.model.js
│   │   └── ...
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   ├── middleware/         # Custom middleware
│   │   └── auth.middleware.js
│   ├── utils/              # Utility functions
│   │   ├── email.util.js
│   │   └── upload.util.js
│   ├── uploads/            # File uploads directory
│   └── server.js           # Entry point
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context API providers
│   │   ├── pages/          # Page components
│   │   │   ├── Public/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Admin/
│   │   │   └── Faculty/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env
├── .env.example
├── package.json
└── README.md
```

## 🗄️ Database Models

### User
- Email, Password (hashed)
- Role (student/faculty/admin/superadmin)
- Email verification status
- OTP for verification

### Profile
- Personal details
- Communication details
- Educational details
- Documents
- Completion status

### AdmissionCycle
- Name, Duration
- Application fees by category
- Brochure URL
- Active status

### Offering
- Department, Specialization
- Offering type
- Deadline, Status
- Results published status

### Application
- User, Offering, Admission Cycle references
- Personal, Communication, Educational details
- Documents, Payment details
- Application status, Remarks, Result

### Template
- Name, Scope, Type
- Email content/body
- Variables for personalization

### EmailLog
- Recipient details
- Subject, Body
- Send status
- Error tracking

### ExcelUpload
- File information
- Processing status
- Email statistics

## 🔐 User Roles & Permissions

### Student
- Complete profile
- Browse positions
- Submit applications
- Track application status

### Faculty
- View department applications
- Access templates
- View analytics

### Admin
- Full access to admissions management
- Create/edit cycles and offerings
- Review applications
- Send bulk emails
- Manage templates
- View analytics

### Super Admin
- All admin permissions
- User management
- Assign admin roles

## 📧 Email Templates

The system includes pre-built email templates:

1. **OTP Verification**: Sent during registration
2. **Application Submission**: Confirmation email
3. **Acceptance Email**: For selected candidates
4. **Rejection Email**: Personalized rejection with remarks
5. **Password Reset**: For forgotten passwords

## 📊 Dashboard Analytics

### Admin Dashboard
- Total offerings count
- Admission cycles overview
- Total applications
- Category-wise applications chart
- Gender-wise applications chart
- Filterable by cycle and department

## 📤 Bulk Email System

1. Admin uploads Excel file with columns:
   - Name
   - Email_ID
   - Result (Selected/Rejected)
   - Remarks

2. Select email template

3. System sends personalized emails to all recipients

4. Track email delivery status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- Role-based access control
- File upload validation
- OTP verification for email
- Reset password functionality

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/verify-otp - Verify email OTP
- POST /api/auth/login - Login user
- POST /api/auth/forgot-password - Request password reset
- GET /api/auth/me - Get current user

### Application Endpoints
- GET /api/applications - Get all applications (admin/faculty)
- POST /api/applications - Submit new application
- GET /api/applications/:id - Get application details
- PUT /api/applications/:id - Update application
- DELETE /api/applications/:id - Delete application

### Admission Cycle Endpoints
- GET /api/admission-cycles - Get all cycles
- POST /api/admission-cycles - Create new cycle
- PUT /api/admission-cycles/:id - Update cycle
- DELETE /api/admission-cycles/:id - Delete cycle

[More endpoints documented in API docs]

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
sudo service mongod start
```

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled
- Ensure less secure app access is disabled (use app passwords instead)

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
heroku create iit-ropar-admissions-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
cd client
vercel --prod
```

### Environment Variables for Production
- Set all variables from .env.example
- Use strong JWT_SECRET
- Use production MongoDB URI
- Configure production email settings
- Update CLIENT_URL to production frontend URL

## 👥 Default Users

After setup, create initial admin user via MongoDB:

```javascript
db.users.insertOne({
  email: "admin@iitrpr.ac.in",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "superadmin",
  isVerified: true,
  createdAt: new Date()
})
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email coapcell@iitrpr.ac.in or create an issue in the repository.

## 🙏 Acknowledgments

- IIT Ropar Academic Affairs
- All contributors and testers

---

**Built with ❤️ for IIT Ropar**
