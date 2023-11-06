"use strict";

//! File này dùng để Lưu token vào trong db, sau này chắc dùng để refreshToken

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });
            // // nếu tạo thành công thì trả về public key  <=> null
            // return tokens ? tokens.publicKey : null;

            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokenUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true };

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
    static findByUserId = async (userId) => {
        return await keyTokenModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id);
    };
}

module.exports = KeyTokenService;
