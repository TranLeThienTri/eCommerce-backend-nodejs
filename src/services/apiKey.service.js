"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");

const findById = async (key) => {
    try {
        // const newObjKey = await apiKeyModel.create({
        //     key: crypto.randomBytes(64).toString("hex"),
        //     permissions: ["0000"],
        // });
        // console.log("newObjKey:: ", newObjKey);
        const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
        return objKey;
    } catch (error) {}
};

module.exports = { findById };
