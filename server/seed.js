const mongoose = require('mongoose');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iit-ropar-admissions');
        console.log('Connected to MongoDB');

        // Create Admin
        const adminEmail = 'admin@iitrpr.ac.in';
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            await User.create({
                email: adminEmail,
                password: 'password123',
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user created: admin@iitrpr.ac.in / password123');
        } else {
            console.log('Admin user already exists');
        }

        // Create Faculty
        const facultyEmail = 'faculty@iitrpr.ac.in';
        const facultyExists = await User.findOne({ email: facultyEmail });
        if (!facultyExists) {
            await User.create({
                email: facultyEmail,
                password: 'password123',
                role: 'faculty',
                isVerified: true,
                departments: ['Computer Science']
            });
            console.log('Faculty user created: faculty@iitrpr.ac.in / password123');
        } else {
            console.log('Faculty user already exists');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
