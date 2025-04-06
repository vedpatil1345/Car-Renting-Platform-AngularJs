const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdminUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/carRental', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminData = {
            email: "vedpatil13042005@gmail.com",
            password: "iaHzWYQY3tcvkZt",
            role: "admin",
            createdAt: new Date(),
            lastLogin: null
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        adminData.password = hashedPassword;

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.connection.close();
    }
}

createAdminUser();