"use strict";

const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
} = require("../models/repository/product.repo");
//define factory class to create product
class ProductFactory {
    /**
     *
     * @param {'Clothing'} type
     * @param {*} payload
     */

    static productRegistry = {};
    static ProductRegisterType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    // POST //
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Product type "${type}`);
        return new productClass(payload).createProduct();
    }

    // END POST //
    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }
    // END PUT //

    // QUERY //
    static async findAllDraftsForShop({ product_shop, limit = 60, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 60, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async getListSearchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({
        limit = 60,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ["product_name", "product_thumb", "product_price"],
        });
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] });
    }
    // END QUERY //

    // static async createProduct(type, payload) {
    //     switch (type) {
    //         case "Clothing":
    //             return new Clothing(payload).createProduct();
    //         case "Electronics":
    //             return new Electronics(payload).createProduct();
    //         default:
    //             throw new BadRequestError(`Invalid product type: ${type}`);
    //     }
    // }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create Product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }
}
//define sub-class for different products types clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing)
            throw new BadRequestError("Create new Clothing error!");
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("Create new product error!");
        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new BadRequestError("Create new Electronic error!");
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new product error!");
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture)
            throw new BadRequestError("Create new furniture error!");
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("Create new product error!");
        return newProduct;
    }
}

//register products types
ProductFactory.ProductRegisterType("Electronics", Electronics);
ProductFactory.ProductRegisterType("Clothing", Clothing);
ProductFactory.ProductRegisterType("Furniture", Furniture);

module.exports = ProductFactory;
