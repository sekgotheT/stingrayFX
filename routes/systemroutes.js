// routes/systemRoutes.js
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/features', systemController.getSystemFeatures);

module.exports = router;
