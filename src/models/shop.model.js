"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

// set tên của document và collection
const DOCUMENT_NAME = "shop";
const COLLECTION_NAME = "Shops";

//! sử dụng từ khoá !dmbg để có thể generate nhanh một cái schema
//? sau khi được generate thì sửa lại tên mong muốn là có thể sử dụng
// Declare the Schema of the Mongo model
var shopSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            //cho biết shop có đang hoạt động hay không
            enum: ["active", "inactive"],
            default: "inactive",
        },
        verify: {
            // cho biết đã được xác thực hay chưa
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            // một mảng, để mặt định là rỗng
            type: Array,
            default: [],
        },
    },
    {
        // sẽ tự động có createAt và updateAt
        timestamps: true,
        //set collection
        collection: COLLECTION_NAME,
    }
);

//Export the model
// set cho db
module.exports = model(DOCUMENT_NAME, shopSchema);
