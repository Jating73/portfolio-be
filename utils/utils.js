////////////////////////////////////////////////////////////////////////
// Required modules
////////////////////////////////////////////////////////////////////////

const request = require('request');
const fetch = require('node-fetch');
const _ = require('lodash');

////////////////////////////////////////////////////////////////////////
// Exported modules
////////////////////////////////////////////////////////////////////////
exports.sendPostRequestToAnyServer = sendPostRequestToAnyServer;
exports.sendGetRequestToAnyServer = sendGetRequestToAnyServer;
exports.promisifiedSendPostRequestToAnyServer = promisifiedSendPostRequestToAnyServer;
exports.sendFetchGetRequestToAnyServer = sendFetchGetRequestToAnyServer;
exports.modifyArrayObject = modifyArrayObject;

////////////////////////////////////////////////////////////////////////
// Modules Definition
////////////////////////////////////////////////////////////////////////

function sendGetRequestToAnyServer(handlerInfo, event, url, params, resultWrapper, callback) {
    url = url + '?';
    if (Object.keys(params).length) {
        params.map(function (param) {
            url += param.param_name + '=' + param.param_value + '&';
        });
    }

    url = url.slice(0, -1);
    var options = {
        url: url,
        method: "GET",
        json: true,
        rejectUnauthorized: false,
        gzip: true,
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    if (resultWrapper.header_explicit) {
        options.headers = resultWrapper.header_explicit;
        delete resultWrapper.header_explicit;
    }

    if (resultWrapper.timeout_explicit) {
        options.timeout = resultWrapper.timeout_explicit;
        delete resultWrapper.timeout_explicit;
    }

    request(options, function (error, response, body) {
        if (error || response.statusCode != '200') {
            // console.error(handlerInfo, { EVENT: 'Error response while ' + event },
            //     { OPTIONS: options }, { ERROR: error }, { RESPONSE: response }, { BODY: body });
            callback(new Error('Failure from url : ' + url), null);
        }
        else {
            // console.trace(handlerInfo, { EVENT: 'Response from event:  ' + event },
            //     { OPTIONS: options }, { ERROR: error }, { RESPONSE: response }, { BODY: body });
            if (body && body.data) {
                resultWrapper.data = body.data;
            } else {
                resultWrapper.data = body;
            }

            callback(null);
        }
    });
}

function sendPostRequestToAnyServer(handlerInfo, event, url, body, callback) {
    var dupBody = body;
    var options = {
        url: url,
        method: 'POST',
        body: body,
        json: true,
        rejectUnauthorized: false,
        timeout: 5000,
        gzip: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    if (body.set_timeout_explicit) {
        options.timeout = body.set_timeout_explicit;
        delete body.set_timeout_explicit;
    }

    if (body.header_explicit) {
        options.headers = body.header_explicit;
        delete options.body.header_explicit;
    }

    request(options, function (error, response, body) {
        if (error || response.statusCode != '200') {
            if (dupBody.logging_enabled) {
                // console.error(handlerInfo, { EVENT: 'Error response while ' + event },
                //     { OPTIONS: options }, { ERROR: error }, { RESPONSE: response }, { BODY: body });
            }

            callback(new Error('Failure from url : ' + url), null);
        }
        else {
            // console.trace(handlerInfo, { EVENT: 'Response from event:  ' + event },
            //     { OPTIONS: options }, { ERROR: error }, { RESPONSE: response }, { BODY: body });

            callback(null, body);
        }
    });
}

function promisifiedSendPostRequestToAnyServer(handlerInfo, event, url, body) {
    return new Promise((resolve, reject) => {
        var dupBody = body;

        if (body.timeout) {
            var timeout = +body.timeout;
            delete body.timeout;
        }

        var options = {
            url: url,
            method: 'POST',
            body: body,
            json: true,
            rejectUnauthorized: false,
            timeout: timeout || 5000,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        if (body.is_gzipped_response) {
            options.gzip = true;
            delete body.is_gzipped_response;
        }

        if (body.set_timeout_explicit) {
            options.timeout = body.set_timeout_explicit;
            delete body.set_timeout_explicit;
        }

        request(options, function (error, response, body) {
            if (error || response.statusCode != '200') {
                if (dupBody.logging_enabled) {
                    // console.error(handlerInfo, { EVENT: 'Error response while ' + event },
                    //     { OPTIONS: options }, { ERROR: error }, { RESPONSE: response }, { BODY: body });
                }
                return reject(new Error('Failure from url : ' + url));
            }
            else {
                // console.trace(handlerInfo, { EVENT: 'Response from event:  ' + event },
                //     { OPTIONS: options }, { RESPONSE: response }, { BODY: body });
                return resolve(body);
            }
        });
    });
}

async function sendFetchGetRequestToAnyServer(handlerInfo, event, url, params, resultWrapper) {

    url = url + '?';
    if (Object.keys(params).length) {
        params.map(function (param) {
            url += param.param_name + '=' + param.param_value + '&';
        });
    }

    url = url.slice(0, -1);
    var options = {
        method: "GET",
        redirect: 'follow',
        json: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    if (resultWrapper.header_explicit) {
        options.headers = resultWrapper.header_explicit;
        delete resultWrapper.header_explicit;
    }

    if (resultWrapper.timeout_explicit) {
        options.timeout = resultWrapper.timeout_explicit;
        delete resultWrapper.timeout_explicit;
    }

    let result = await fetch(url, options);

    if (result.status != 200) {
        throw new Error(`${result.statusText}`);
    }

    result = await result.json();

    // console.trace(handlerInfo, { EVENT: 'Response from event:  ' + event },
    //     { OPTIONS: options }, { RESPONSE: result });

    return result;
}

async function modifyArrayObject(handlerInfo, dataWrapper, keys) {

    await dataWrapper.forEach((data, index) => {
        let new_data = selectSpecificKeys(handlerInfo, data, keys);
        dataWrapper[index] = new_data;
    });

    return dataWrapper;
}

function selectSpecificKeys(handlerInfo, obj, keys) {

    const selectedKeys = _.pick(obj, keys);
    return selectedKeys;
}