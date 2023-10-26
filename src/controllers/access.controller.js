"use strict";

const AccessService = require("../services/access.service");

class AccessController {
    //signUp
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::SignUp:: `, req.body);
            // console.log(req.body);
            return res.status(201).json(await AccessService.signUp(req.body));
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessController();
