"use strict";

const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                },
            },
            options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateQuantityInUserCart({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
                cart_userId: userId,
                "cart_products.productId": productId,
                cart_state: "active",
            },
            updateSet = {
                $inc: {
                    "cart_products.$.quantity": quantity,
                },
            },
            options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCard({ userId, product }) {
        //check cart tồn tại hay không
        const userCart = await cart.findOne({ cart_userId: userId });
        if (!userCart) {
            // create a cart
            return await CartService.createUserCart({ userId, product });
        }

        // neu da ton tai va khong co san phamm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // da ton tai va co san pham+>>>>> update so luong
        return await CartService.updateQuantityInUserCart({ userId, product });
    }

    //update cart
    /**
     * shop_order_ids:[
     *  {
     *  shopId,
     * item_products:[{
     *  quantity
     *  price,
     *  shopId
     *  old_quantity
     *  quantity
     *  prductId
     * }]
     * }
     * ]
     */

    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];

        const foundProduct = await getProductById(productId);
        if (!foundProduct) {
            throw new NotFoundError("nt found product");
        }
        if (
            foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId
        ) {
            throw new NotFoundError("product do not belong to the shop");
        }
        if (quantity === 0) {
            // delete
            deleteUserCart({ userId, productId });
            console.log(`:::Xoá thành cong`);
        }
        return await CartService.updateQuantityInUserCart({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        });
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            };
        console.log(query);
        const deleteCart = await cart.updateOne(query, updateSet);
        return deleteCart;
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({ cart_userId: +userId }).lean();
    }
}

module.exports = CartService;
