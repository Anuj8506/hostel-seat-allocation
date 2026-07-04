const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hostelName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['first-year', 'senior'],
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentOccupancy: {
        type: Number,
        default: 0,
        min: 0
    }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);