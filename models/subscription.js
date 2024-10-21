const mongoose = require('mongoose');

// Define the subscription schema
const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,       // Email is required
        unique: true,         // Ensure email is unique
        lowercase: true,      // Automatically convert email to lowercase
        trim: true            // Trim any extra spaces from the email
    },
    plan: {
        type: String,
        required: true,       // Plan is required
    },
    startDate: {
        type: Date,
        default: Date.now    // Default to the current date when the subscription is created
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],  // Only allow 'active' or 'inactive' as valid values
        default: 'active'    // Default status is 'active'
    }
}, { timestamps: true }); // Add timestamps to track creation and updates

// Create the model based on the schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
