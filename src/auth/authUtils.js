"use strict";

//! File này sử dụng để có tạo ra cặp tokens

const JWT = require("jsonwebtoken");
// private key dùng để đăng kí còn public key dùng để xác thực.
const createTokensPair = async (payload, publicKey, privateKey) => {
    try {
        // tạo access token
        // với access token thì sử dụng public key để đăng kí jwt
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });
        // tạo refresh token
        // còn với refresh token thì phải sử dụng private key, để khi hacker muốn hack thì nó phải biết được cả 2 key
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        }); 

        // tại vì accessToken dùng public key để đăng kí nên là muốn xác thực thì phải dùng public key để xác thực
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
