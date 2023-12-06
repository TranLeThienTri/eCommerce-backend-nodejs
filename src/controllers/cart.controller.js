"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
    //new
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "create new cart successfully",
            metadata: await CartService.addToCard(req.body),
        }).send(res);
    };

    update = async (req, res, next) => {
        new SuccessResponse({
            message: "update cart successfully",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res);
    };

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "deleted cart successfully",
            metadata: await CartService.deleteUserCart(req.body),
        }).send(res);
    };

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "List cart successfully",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res);
    };
}

module.exports = new CartController();
