const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscribe', subscriptionController.subscribe);
router.get('/subscriptions', subscriptionController.getSubscriptions);

module.exports = router;
