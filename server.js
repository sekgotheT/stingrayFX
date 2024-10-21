const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure to set your Stripe secret key in .env
require('dotenv').config();

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to STINGRAYFX backend!');
});

// Use routes
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/payment', paymentRoutes);

// Endpoint to create a payment intent
app.post('/api/payment/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'zar', // Change to your desired currency
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint to handle payment confirmation
app.post('/api/payment/handle-payment', async (req, res) => {
    const { paymentMethodId, amount } = req.body; // Get payment method and amount from request

    try {
        // Confirm the payment using the payment method ID
        const paymentIntent = await stripe.paymentIntents.confirm(paymentMethodId, {
            amount: amount,
        });

        // Check if the payment was successful
        if (paymentIntent.status === 'succeeded') {
            res.status(200).send({ success: true, message: 'Payment successful!' });
        } else {
            res.status(400).send({ success: false, message: 'Payment failed. Please try again.' });
        }
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
