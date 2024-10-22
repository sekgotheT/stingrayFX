const express = require('express');
const router = express.Router();

// Import the subscription controller
const subscriptionController = require('../controllers/subscriptionController');

// POST route to create a subscription
router.post('/', subscriptionController.createSubscription); // This will handle /api/subscribe

// GET route to retrieve subscriptions
router.get('/', subscriptionController.getSubscriptions);  // This will handle /api/subscribe (or /api/subscriptions, depending on your design)

// Export the router
module.exports = router;
