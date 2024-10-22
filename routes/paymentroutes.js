const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Stripe setup
const paypal = require('paypal-rest-sdk');  // PayPal setup
const axios = require('axios');  // Used for third-party APIs (e.g., FNB, Neteller, Skrill)

// PayPal configuration
paypal.configure({
    mode: process.env.PAYPAL_MODE,  // Use environment variable for mode (sandbox/live)
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Payment method setup (for mockup)
const paymentMethods = {
    fnb: {
        apiKey: process.env.FNB_API_KEY,
        apiUrl: process.env.FNB_API_URL,
    },
    neteller: {
        apiKey: process.env.NETELLER_API_KEY,
        apiUrl: process.env.NETELLER_API_URL,
    },
    skrill: {
        apiKey: process.env.SKRILL_API_KEY,
        apiUrl: process.env.SKRILL_API_URL,
    },
    ewallet: {
        apiKey: process.env.EWALLET_API_KEY,
        apiUrl: process.env.EWALLET_API_URL,
    }
};

// POST route for handling payments
router.post('/', async (req, res) => {
    const { method, amount, currency, email, payment_method_id } = req.body;

    if (!method || !amount || !currency) {
        return res.status(400).json({ message: 'Payment method, amount, and currency are required!' });
    }

    try {
        switch (method) {
            // PayPal Payment
            case 'paypal':
                const createPaymentJson = {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    redirect_urls: {
                        return_url: 'http://example.com/success',
                        cancel_url: 'http://example.com/cancel'
                    },
                    transactions: [{
                        amount: {
                            total: amount,
                            currency: currency
                        },
                        description: `Payment for subscription plan by ${email}`
                    }]
                };

                paypal.payment.create(createPaymentJson, (error, payment) => {
                    if (error) {
                        return res.status(500).json({ message: 'Payment creation failed', details: error });
                    }
                    const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                    return res.json({ approval_url: approvalUrl });
                });
                break;

            // Stripe Payment
            case 'stripe':
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount * 100, // Stripe expects the amount in cents
                    currency: currency,
                    payment_method: payment_method_id, // Payment method ID sent from frontend
                    confirm: true,
                });
                return res.json({ message: 'Stripe payment successful!', paymentIntent });

            // Mockup for FNB Payment
            case 'fnb':
                const fnbResponse = await axios.post(paymentMethods.fnb.apiUrl, {
                    email,
                    amount,
                    currency,
                    method: 'FNB'
                });
                if (fnbResponse.data.status === 'success') {
                    return res.json({ message: 'FNB payment successful!' });
                } else {
                    return res.status(500).json({ message: 'FNB payment failed' });
                }

            // Mockup for Neteller Payment
            case 'neteller':
                const netellerResponse = await axios.post(paymentMethods.neteller.apiUrl, {
                    email,
                    amount,
                    currency,
                    method: 'Neteller'
                });
                if (netellerResponse.data.status === 'success') {
                    return res.json({ message: 'Neteller payment successful!' });
                } else {
                    return res.status(500).json({ message: 'Neteller payment failed' });
                }

            // Mockup for Skrill Payment
            case 'skrill':
                const skrillResponse = await axios.post(paymentMethods.skrill.apiUrl, {
                    email,
                    amount,
                    currency,
                    method: 'Skrill'
                });
                if (skrillResponse.data.status === 'success') {
                    return res.json({ message: 'Skrill payment successful!' });
                } else {
                    return res.status(500).json({ message: 'Skrill payment failed' });
                }

            // Mockup for E-Wallet Payment
            case 'ewallet':
                const ewalletResponse = await axios.post(paymentMethods.ewallet.apiUrl, {
                    email,
                    amount,
                    currency,
                    method: 'E-wallet'
                });
                if (ewalletResponse.data.status === 'success') {
                    return res.json({ message: 'E-wallet payment successful!' });
                } else {
                    return res.status(500).json({ message: 'E-wallet payment failed' });
                }

            default:
                return res.status(400).json({ message: 'Unsupported payment method!' });
        }
    } catch (error) {
        console.error('Payment Error:', error);
        return res.status(500).json({ message: 'Payment failed', details: error.message });
    }
});

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Get the amount from request
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'zar',
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Handle Payment
router.post('/handle-payment', async (req, res) => {
    const { paymentMethodId, amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentMethodId, {
            amount,
        });
        res.status(200).send({ success: true, message: 'Payment successful!' });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = router;
