const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure your Stripe secret key is in .env
const nodemailer = require('nodemailer');
require('dotenv').config();

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email from .env
        pass: process.env.PASSWORD // Your email password or app password
    }
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

// Endpoint for contact form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Prepare the email
    const mailOptions = {
        from: email, // Sender's email
        to: process.env.EMAIL, // Your email to receive the message
        subject: `New Contact Form Submission from ${name}`,
        text: `You have a new message from ${name} (${email}):\n\n${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).send('Something went wrong. Please try again later.');
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send('Message sent successfully.');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
