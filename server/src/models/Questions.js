const mongoose = require('mongoose');


const questionsSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    content: { type: String, required: true },
    // This should be userId from User schema for future reference
    user: { type: String, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Questions', questionsSchema);