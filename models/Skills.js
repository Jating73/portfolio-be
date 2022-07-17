const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const skillModel = mongoose.model('skill', skillSchema);

module.exports = skillModel;