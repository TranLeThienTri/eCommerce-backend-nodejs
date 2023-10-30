"use strict";

const AccessService = require("../services/access.service");

class AccessController {
    //signUp
    signUp = async (req, res, next) => {
        try {
            console.log(req.body);
            console.log(`[P]::SignUp:: `, req.body);
            // console.log(req.body);
            // sử dụng dữ liệu từ client để có thể đăng kí
            return res.status(201).json(await AccessService.signUp(req.body));
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessController();
