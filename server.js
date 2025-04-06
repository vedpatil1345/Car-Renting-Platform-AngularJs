const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Car = require('./models/Car');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role: req.body.role || 'user'
        });
        
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            'secret_key',
            { expiresIn: '24h' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Car routes
app.get('/api/cars', async (req, res) => {
    try {
        const { sort, category } = req.query;
        let query = Car.find();
        
        if (category) {
            query = query.where('category', category);
        }
        
        if (sort === 'price') {
            query = query.sort({ price: 1 });
        } else if (sort === 'name') {
            query = query.sort({ name: 1 });
        }
        
        const cars = await query.exec();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
    }
});

app.post('/api/cars', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const car = new Car(req.body);
        await car.save();
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: 'Error adding car', error: error.message });
    }
});

app.delete('/api/cars/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error: error.message });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', mongodb: mongoose.connection.readyState === 1 });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});