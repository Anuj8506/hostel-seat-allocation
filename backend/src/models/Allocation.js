const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    preference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preference',
        required: true
    },
    round: {
        type: Number,
        enum: [1, 2],
        required: true
    },
    status: {
        type: String,
        enum: ['allocated', 'cancelled'],
        default: 'allocated'
    }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Allocation', allocationSchema);
