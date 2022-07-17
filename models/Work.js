const mongoose = require('mongoose');

const workSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    employment_type: {
        type: String,
        required: true,
    },
    company_name: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true
    }],
    certificate_urls: []
}, {
    timestamps: true
});

const workModel = mongoose.model('work', workSchema);

module.exports = workModel;