const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
    },
    associated_with: {
        type: String,
    },
    project_url: {
        type: String
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const projectModel = mongoose.model('project', projectSchema);

module.exports = projectModel;