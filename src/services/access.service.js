"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailError,
} = require("../core/error.response");
// service
const { findByEmail } = require("./shop.service");
//? Role của shop
const RoleShop = {
    SHOP: "SHOP",
    ADMIN: "ADMIN",
    WRITE: "WRITE",
    EDITOR: "EDITOR",
};

class AccessService {
    //handle RefreshToken
    static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyById(userId);
            throw new ForbiddenError("Something wrong happend!! Pls relogin");
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailError("Shop not registered");
        }
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailError("Shop not registered");

        const tokens = await createTokensPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        console.log(typeof keyStore);

        await keyStore.updateOne({
            $set: { refreshToken: tokens.refreshToken },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            }, // đã được sử dụng để lấy token mới
        });
        return {
            user,
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(delKey);
        return delKey;
    };

    static login = async ({ email, password, refreshToken = null }) => {
        /*
            #step1: check exist email
            #step2: check match password
            #step3: create AT, RT and save
            #step4: generate tokens
            #step5: get data return login
        */
        // 1 - check shop exists
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("shop not registered!");
        // 2 - check match password
        const matchPassword = await bcrypt.compare(
            password,
            foundShop.password
        );

        if (!matchPassword) throw new AuthFailError("password incorrect");
        // 3 - create AT and RT and save
        const publicKey = await crypto.randomBytes(64).toString("hex");
        const privateKey = await crypto.randomBytes(64).toString("hex");
        // 4 - generate tokens

        const tokens = await createTokensPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });
        return {
            shop: getInfoData({
                fileds: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        // step1 : check sự tồn tại của email
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError(`Error: An email already registered!`);
        }
        // mã hoá password
        const hashPassword = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
            role: [RoleShop.SHOP],
        });
        // nếu tạo shop thành công thì sẽ tạo ra public key và private key
        if (newShop) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");
            console.log({ publicKey, privateKey }); // save collection keyStore
            // tạo public key string
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });
            // kiểm tra public key string có tồn tại hay không
            if (!keyStore) {
                throw new BadRequestError("Error: Key not in database");
            }
            // tạo cặp access token và refresh token từ public key string
            const tokens = await createTokensPair(
                {
                    userId: newShop._id,
                    email,
                },
                publicKey,
                privateKey
            );
            console.log(`Create tokens successfully:: `, tokens);
            // trả về 201  và metadata nếu tạo được
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fileds: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        }

        //trả về 200 và metadata là null nếu k tạo được
        return {
            code: 200,
            metadata: null,
        };
    };
}
module.exports = AccessService;
