const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Added for static file serving
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Home route to serve 'index.html'
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

// Add subscription controller logic directly
app.post('/api/subscribe', (req, res) => {
    const { email, plan } = req.body;
    // Assuming the data gets processed here (you can add more logic like saving to the DB)
    res.json({
        message: 'Subscription created successfully!',
        email,
        plan
    });
});

// Subscription route (updated to use external controller)
const subscriptionRoutes = require('./routes/subscriptionRoutes');  // Adjust path if necessary
app.use('/api', subscriptionRoutes);

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
