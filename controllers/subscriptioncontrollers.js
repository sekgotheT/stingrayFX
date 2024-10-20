// controllers/subscriptionController.js

// Dummy subscription controller to handle subscription requests
const Subscription = require('../models/subscription');

// Subscribe user
exports.subscribeUser = (req, res) => {
    const { email, plan } = req.body;

    const newSubscription = new Subscription({ email, plan });

    newSubscription.save()
        .then((subscription) => res.status(201).json({
            message: 'Subscription successful!',
            subscription
        }))
        .catch((err) => res.status(500).json({ error: 'Subscription failed', details: err }));
};

// Get subscriptions
exports.getSubscriptions = (req, res) => {
    Subscription.find()
        .then((subscriptions) => res.status(200).json(subscriptions))
        .catch((err) => res.status(500).json({ error: 'Failed to retrieve subscriptions', details: err }));
};
