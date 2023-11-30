"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Discount Code successfully created",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: "get all discount by shop",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                // lấy limit, page đồ ở url nên là phải query
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get all discount with product",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            }),
        }).send(res);
    };
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "amount discount",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
