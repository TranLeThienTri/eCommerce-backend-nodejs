"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
// const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_slug: String, // quan-ao
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            require: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        //more
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be pre 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, required: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//create index for product
productSchema.index({ product_name: "text", product_description: "text" });

//document middleware: run before .save() and create() ...
productSchema.pre("save", function (next) {
    (this.product_slug = slugify(this.product_name, {
        replacement: "-",
        lower: true,
    })),
        next();
});

//define the product type = clothing

const ClothingSchema = new Schema(
    {
        brand: {
            type: String,
            require: true,
        },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "Clothes",
        timestamps: true,
    }
);
const FurnitureSchema = new Schema(
    {
        brand: {
            type: String,
            require: true,
        },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "Furnitures",
        timestamps: true,
    }
);

const ElectronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            require: true,
        },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        timestamps: true,
        collection: "Electronics",
    }
);

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothe", ClothingSchema),
    electronic: model("Electronic", ElectronicSchema),
    furniture: model("Furniture", FurnitureSchema),
};
