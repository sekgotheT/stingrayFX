const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
const subscriptionController = require('./controllers/subscriptionController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to STINGRAYFX backend!');
});

// Use routes
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/payment', paymentRoutes); 

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
