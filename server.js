const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { startServer } = require('./app');
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to STINGRAYFX backend!');
});

// Payment route
app.post('/api/payment', (req, res) => {
    const { method, amount } = req.body;
    res.json({
        message: 'Payment processed!',
        method,
        amount
    });
});

// Subscription route (updated to use controller)
const subscriptionRoutes = require('../routes/subscriptionRoutes');
app.use('/api', subscriptionRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
