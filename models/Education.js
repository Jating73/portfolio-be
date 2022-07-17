const mongoose = require('mongoose');

const educationSchema = mongoose.Schema({

    institute_name: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
    },
    field_of_study: {
        type: String
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true
    },
    grade: {
        type: String,
    },
    activites: {
        type: String,
    },
    description: {
        type: String,
    },
    certificate_url: {
        type: String
    },
}, {
    timestamps: true
});

const educationModel = mongoose.model('education', educationSchema);

module.exports = educationModel;