"use strict";

const AccessService = require("../services/access.service");
const {  CREATE, SuccessResponse } = require("../core/success.response");
class AccessController {
    //handler RefreshToken
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "get token successfully",
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res);
    };

    //logout
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    //login
    login = async (req, res, next) => {
        // sử dụng dữ liệu từ client để có thể đăng kí
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    //signUp
    signUp = async (req, res, next) => {
        // sử dụng dữ liệu từ client để có thể đăng kí
        new CREATE({
            message: "Register OK",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };
}

module.exports = new AccessController();
