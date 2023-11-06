"use strict";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        // check có x-api-key trong khi post lên không
        if (!key) {
            return res.status(403).json({
                message: "Forbidden not HAEDER error",
            });
        }

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden error",
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.log(error);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "permissions denied",
            });
        }
        console.log("Permission:::", req.objKey.permissions);
        const validPermissions = req.objKey.permissions.includes(permission);
        if (!validPermissions) {
            return res.status(403).json({
                message: "permissions denied",
            });
        }
        return next();
    };
};

module.exports = { apiKey, permission };
