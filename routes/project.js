////////////////////////////////////////////////////////////////////////
// Required modules
////////////////////////////////////////////////////////////////////////
const express = require('express');
const router = express.Router();
const Joi = require('joi');

////////////////////////////////////////////////////////////////////////
// Required functions and constants
////////////////////////////////////////////////////////////////////////
const constants = require('../utils/constants');
const utils = require('../utils/utils');

// Imported Model
const Project = require('../models/Project');

router.get('/', async (req, res) => {

    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;

    try {

        const project = await Project.find({});

        response = {
            message: "Project Fetched successfully",
            data: project
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message,
            error_description: error
        }
        return res.status(statusCode).json(response);
    }
});

router.get('/get_hosted_projects', async (req, res) => {

    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;
    try {

        const handlerInfo = {
            apiModule: "project",
            apiHandler: "getHostedProjects"
        };

        const event = 'Sending Request to Netlify to fetch hosted Projects';
        const url = constants.NETLIFY.BASE_URL + constants.NETLIFY.ENDPOINTS.FETCH_ALL_PROJECTS;
        let params = {};
        let resultWrapper = {};
        const token = process.env.NETLIFY_TOKEN;

        resultWrapper.header_explicit = {
            Authorization: `Bearer ${token}`
        };

        resultWrapper.timeout_explicit = 3000;

        let result = await utils.sendFetchGetRequestToAnyServer(handlerInfo, event, url, params, resultWrapper);

        const keys = ["id", "url", "screenshot_url", "created_at", "updated_at"];

        let data = await utils.modifyArrayObject(handlerInfo, result, keys);

        response = {
            message: "Data Fetched successfully",
            data: data
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message,
            error_description: error
        }
        return res.status(statusCode).json(response);
    }
});

router.post('/', async (req, res) => {

    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;

    try {

        const body = req.body;
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            start_date: Joi.date().format("YYYY-MM-DD").required(),
            end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").required().min(Joi.ref('start_date')),
            associated_with: Joi.string().optional(),
            project_url: Joi.string().optional(),
            description: Joi.string().optional()
        }).options({ allowUnknown: true });

        const result = Joi.validate(body, schema);

        if (result.error) {
            throw (new Error("Parameters Missing or not valid"));
        }

        let project = new Project(body);

        project = await project.save();

        if (!project) {
            throw new Error("Unable to complete action");
        }

        response = {
            message: "Project Added successfully",
            data: project
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message,
            error_description: error
        }
        return res.status(statusCode).json(response);
    }
});

router.post('/:id', async (req, res) => {

    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;

    try {

        const params = req.params;
        const body = req.body;

        body.id = params.id;

        const schema = Joi.object().keys({
            id: Joi.string().required(),
            update_keys: Joi.object().keys({
                name: Joi.string().required(),
                start_date: Joi.date().format("YYYY-MM-DD").required(),
                end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").required().min(Joi.ref('start_date')),
                associated_with: Joi.string().optional(),
                project_url: Joi.string().optional(),
                description: Joi.string().optional()
            })
        }).options({ allowUnknown: true });

        const result = Joi.validate(body, schema);

        if (result.error) {
            throw (new Error("Parameters Missing or not valid"));
        }

        let project = new Project(body);

        project = await project.save();

        if (!project) {
            throw new Error("Unable to complete action");
        }

        response = {
            message: "Project Updated successfully",
            data: project
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message,
            error_description: error
        }
        return res.status(statusCode).json(response);
    }
});

router.delete('/:id', async (req, res) => {

    let response = {};
    let statusCode = constants.statusCodes.BAD_REQUEST;

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

        let project = new Project(body);

        project = await project.save();

        if (!project) {
            throw new Error("Unable to complete action");
        }

        response = {
            message: "Project Deleted successfully"
        };

        statusCode = constants.statusCodes.SUCCESS;

        return res.status(statusCode).json(response);

    } catch (error) {
        response = {
            error: error.message,
            error_description: error
        }
        return res.status(statusCode).json(response);
    }
});

module.exports = router;