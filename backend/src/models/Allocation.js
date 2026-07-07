const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        sparse: true,
        unique: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    preference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preference',
    },
    round: {
        type: Number,
        enum: [1, 2],
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
