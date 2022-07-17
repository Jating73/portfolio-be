exports.statusCodes = {
    "SUCCESS": 200,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "NOT_FOUND": 404,
    "INTERNAL_SERVER_ERROR": 500
};

exports.NETLIFY = {
    BASE_URL: 'https://api.netlify.com',
    ENDPOINTS: {
        FETCH_ALL_PROJECTS: '/api/v1/sites'
    }
};

exports.EMAILJS = {
    SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY
};