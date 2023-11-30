"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoDB } = require("../utils");
const {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExists,
} = require("../models/repositories/discount.repo");

/**
 * Discount service
 * - Generates a discount
 * - Get discount
 * - get all discount codes
 * - verify discount codes
 * - delete discount codes
 * - cancel discount codes
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;

        if (
            new Date() < new Date(start_date) ||
            new Date(end_date) < new Date()
        ) {
            throw new BadRequestError("Discount code has expired");
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date");
        }
        // create discount code
        const foundDiscountCode = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId),
            })
            .lean();
        if (foundDiscountCode && foundDiscountCode.discount_isActive) {
            throw new BadRequestError("Discount exists");
        }

        const newDiscountCode = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_isActive: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });
        return newDiscountCode;
    }

    static async updateDiscountCode() {}

    // lấy tất cả discount của sản phẩm
    static async getAllDiscountCodeWithProduct({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        const foundDiscountCode = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId),
            })
            .lean();

        if (!foundDiscountCode) {
            throw new NotFoundError("discount code not exist!");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscountCode;
        let products;
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDB(shopId),
                    isPublished: true,
                },
                page: +page,
                limit: +limit,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                page: +page,
                limit: +limit,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        return products;
    }

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoDB(shopId),
                discount_isActive: true,
            },
            model: discount,
            unSelect: ["__v", "discount_shopId"],
        });
        return discounts;
    }

    static async getDiscountAmount({ code, shopId, userId, products }) {
        const foundDiscountCode = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId),
            },
        });

        if (!foundDiscountCode) {
            throw new NotFoundError(`discount does not exists`);
        }
        const {
            discount_isActive,
            discount_start_date,
            discount_end_date,
            discount_max_uses,
            discount_min_order_value,
            discount_type,
            discount_value,
        } = foundDiscountCode;
        if (!discount_isActive) {
            throw new NotFoundError(`discount expired!`);
        }
        if (!discount_max_uses) {
            throw new NotFoundError(`discount are out`);
        }

        if (
            new Date(discount_start_date) > new Date() ||
            new Date(discount_end_date) < new Date()
        ) {
            throw NotFoundError(`discount has expired!`);
        }

        // check xem có giá trị tối thiểu hay không
        let totalOrder = 0;
        console.log(discount_min_order_value);
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + product.product_price * product.product_quantity;
            }, 0);
        }
        if (totalOrder < discount_min_order_value) {
            throw new BadRequestError(
                `discount requires a minimum order value of ${discount_min_order_value}`
            );
        }

        //check xem dis thuộc loại nào
        const amount =
            discount_type === "fixed_amount"
                ? discount_value
                : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    static async deleteDiscount({ shopId, codeId }) {
        const deleteDiscount = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongoDB(shopId),
        });
        return deleteDiscount;
    }

    static async cancelDiscount({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,

            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDB(shopId),
            },
        });

        if (!foundDiscount) {
            throw new NotFoundError(`Discount don't exist`);
        }

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            // xoá người dùng ra và tăng số lượng có thể sử dụng, giảm số discount đã sử dụng
            $pull: {
                discount_users_used: userId,
                s,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });
        return result;
    }
}

module.exports = DiscountService;
