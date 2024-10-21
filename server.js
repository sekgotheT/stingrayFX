const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaced body-parser with built-in express.json()

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Print MongoDB URI for debugging
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Mongoose connection with added options
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Routes
const subscriptionRoutes = require('./routes/subscriptionRoutes'); // Assuming the routes file is in 'routes'
app.use('/api', subscriptionRoutes);  // Add subscription routes under '/api'

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to STINGRAYFX backend!');
});

// Payment route with error handling
app.post('/api/payment', (req, res) => {
    const { method, amount } = req.body;
    if (!method || !amount) {
        return res.status(400).json({
            error: 'Method and amount are required'
        });
    }
    res.json({
        message: 'Payment processed!',
        method,
        amount
    });
});

// Route to retrieve subscriptions (this can be replaced with real DB logic)
app.get('/api/subscriptions', (req, res) => {
    res.json({
        message: 'Retrieved subscriptions!',
        subscriptions: []  // Placeholder for real subscription data
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
