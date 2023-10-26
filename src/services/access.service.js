"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
    SHOP: "SHOP",
    ADMIN: "ADMIN",
    WRITE: "WRITE",
    EDITOR: "EDITOR",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1 : check sự tồn tại của email
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    // xxx tự định nghĩa trong doc
                    code: "xxxx",
                    message: "Shop already registered",
                };
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
                    return {
                        code: "xxxx",
                        message: "keyStore error",
                    };
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
        } catch (error) {
            return {
                // xxx tự định nghĩa trong document('xxx' là mã lỗi)
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}
module.exports = AccessService;
