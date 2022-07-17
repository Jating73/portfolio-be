const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    issued_by: {
        type: String,
        required: true,
    },
    issued_date: {
        type: Date,
        required: true,
    },
    expiry_date: {
        type: Date,
    },
    description: {
        type: String,
        required: true,
    },
    certificate_id: {
        type: String,
    },
    certificate_url: {
        type: String
    },
}, {
    timestamps: true
});

const certificateModel = mongoose.model('certificate', certificateSchema);

module.exports = certificateModel;