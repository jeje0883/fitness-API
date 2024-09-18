const mongoose = require('mongoose');
const User = require('../models/User');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true

    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
});


module.exports = mongoose.model('Workout', workoutSchema);