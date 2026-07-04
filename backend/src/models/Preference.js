const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    rankedHostels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    round: {
        type: Number,
        enum: [1, 2],
        default: 1
    }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Preference', preferenceSchema);