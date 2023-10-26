"use strict";

const JWT = require("jsonwebtoken");
// private key dùng để đăng kí còn public key dùng để xác thực.
const createTokensPair = async (payload, publicKey, privateKey) => {
    try {
        // tạo access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });
        // tạo refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify:: `, err);
            } else {
                console.log(`verify success::`, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
    }
};

module.exports = { createTokensPair };
