const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true
    },
    branch: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    twelfthPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 10
    },
    isAllocated: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
    },{
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);