"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

// set tên của document và collection
const DOCUMENT_NAME = "Inventory";
// vừa sửa cái I ừ hoa sang thường ở collection
const COLLECTION_NAME = "inventories";

//! sử dụng từ khoá !dmbg để có thể generate nhanh một cái schema
//? sau khi được generate thì sửa lại tên mong muốn là có thể sử dụng
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unKnow" },
        inven_stock: { type: Number, require: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        inven_reservation: { type: Array, default: [] },
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
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema),
};
