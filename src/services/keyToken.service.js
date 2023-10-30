"use strict";

//! File này dùng để Lưu token vào trong db, sau này chắc dùng để refreshToken

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey,
            });
            // nếu tạo thành công thì trả về public key  <=> null
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
