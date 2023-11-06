"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

// const StatusCode = {
//     OK: 200,
//     CREATE: 201,
// };

// const ReasonStatusCode = {
//     OK: "OK",
//     CREATE: "CREATE",
// };

class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonStatusCode = ReasonPhrases.OK,
        metadata = {},
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}
class CREATE extends SuccessResponse {
    constructor({
        options = {},
        message,
        statusCode = StatusCodes.CREATED,
        reasonStatusCode = ReasonPhrases.CREATED,
        metadata,
    }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}

module.exports = { OK, CREATE, SuccessResponse };