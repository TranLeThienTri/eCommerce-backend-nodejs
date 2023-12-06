"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active",
        },
        cart_userId: { type: Number, required: true },
        cart_products: { type: Array, required: true, default: [] },
        cart_count_product: { type: Number, default: 0 },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn'",
        },
    }
);

//Export the model
module.exports = { cart: model(DOCUMENT_NAME, cartSchema) };
