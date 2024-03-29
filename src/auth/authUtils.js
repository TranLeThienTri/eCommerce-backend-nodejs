"use strict";

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rftokens-id",
};

//! File này sử dụng để có tạo ra cặp tokens

const JWT = require("jsonwebtoken");
const {
    AuthFailError,
    NotFoundError,
    ForbiddenError,
} = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const { asyncHandle } = require("../helpers/asyncHandler");
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

const authorization = asyncHandle(async (req, res, next) => {
    /*
    1 - check userID missing
    2 - get accessToken 
    3 - verify Token
    4 - check keyStore with this userId
    6 - OK all => return next() 
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailError("Invalid request");
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("not found key in dbs");

    //3
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId)
                throw new AuthFailError("Invalid UserId");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailError("Invalid request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new AuthFailError("Invalid User");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = { createTokensPair, authorization, verifyJWT };
