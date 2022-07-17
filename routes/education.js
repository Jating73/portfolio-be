////////////////////////////////////////////////////////////////////////
// Required modules
////////////////////////////////////////////////////////////////////////
const express = require('express');
const router = express.Router();
const Joi = require('joi');

////////////////////////////////////////////////////////////////////////
// Required functions and constants
////////////////////////////////////////////////////////////////////////
var constants = require('../utils/constants');

// Imported Model
const Education = require('../models/Education');

router.get('/', async (req, res) => {
    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;
    try {
        const education = await Education.find({});

        response = {
            message: "Education Fetched successfully",
            data: education
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message
        }
        return res.status(statusCode).json(response);
    }

});

router.post('/', async (req, res) => {
    let response = {};
    const statusCode = constants.statusCodes.BAD_REQUEST;

    try {
        const body = req.body;
        const schema = Joi.object().keys({
            institute_name: Joi.string().required(),
            degree: Joi.string().optional(),
            field_of_study: Joi.string().optional(),
            start_date: Joi.date().format("YYYY-MM-DD").required(),
            end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").required().min(Joi.ref('start_date')),
            grade: Joi.string().optional(),
            activites: Joi.string().optional(),
            description: Joi.string().optional(),
            certificate_url: Joi.string().optional()
        }).options({ allowUnknown: true });

        const result = Joi.validate(body, schema);

        if (result.error) {
            throw (new Error("Parameters Missing or not valid"));
        }

        let education = new Education(body);

        education = await education.save();

        if (!education) {
            throw new Error("Unable to complete action");
        }

        response = {
            message: "Education Added successfully",
            data: education
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message
        }
        return res.status(statusCode).json(response);
    }
});

router.put('/:id', async (req, res) => {
    let response = {};
    const statusCode = constants.statusCodes.BAD_REQUEST;

    try {
        const params = req.params;
        const body = req.body;

        body.id = params.id;

        const schema = Joi.object().keys({
            id: Joi.string().required(),
            update_keys: Joi.object().keys({
                institute_name: Joi.string().optional(),
                degree: Joi.string().optional(),
                field_of_study: Joi.string().optional(),
                start_date: Joi.date().format("YYYY-MM-DD").optional(),
                end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional().min(Joi.ref('start_date')),
                grade: Joi.string().optional(),
                activites: Joi.string().optional(),
                description: Joi.string().optional(),
                certificate_url: Joi.string().optional()
            })
        }).options({ allowUnknown: true });

        const result = Joi.validate(body, schema);

        if (result.error) {
            throw (new Error("Parameters Missing or not valid"));
        }

        let education = new Education(body);

        education = await education.save();

        if (!education) {
            throw new Error("Unable to complete action");
        }

        response = {
            message: "Education Updated successfully",
            data: education
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message
        }
        return res.status(statusCode).json(response);
    }
});


router.delete('/:id', async (req, res) => {
    let response = {};
    const statusCode = constants.statusCodes.BAD_REQUEST;

    try {
        const params = req.params;
        const body = req.body;

        body.id = params.id;

        const schema = Joi.object().keys({
            id: Joi.string().required()
        }).options({ allowUnknown: true });

        const result = Joi.validate(body, schema);

        if (result.error) {
            throw (new Error("Parameters Missing or not valid"));
        }

        let education = await Education.findById(body.id);

        if (!education) {
            throw new Error("No Such Data found");
        }

        await Education.deleteOne({ _id: body.id });

        response = {
            message: "Education Deleted successfully",
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message
        }
        return res.status(statusCode).json(response);
    }
});

module.exports = router;