"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

// set tên của document và collection
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

//! sử dụng từ khoá !dmbg để có thể generate nhanh một cái schema
//? sau khi được generate thì sửa lại tên mong muốn là có thể sử dụng
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
    {
        discount_name: { type: String, required: true }, // tên discount
        discount_description: { type: String, required: true }, // mô tả của discount
        discount_type: { type: String, default: "fixed_amount" }, // loại discount('giảm giá tiền mặt'), có một loại nữa là percentage("%")
        discount_value: { type: number, required: true }, // 10.000VND or 10%
        discount_code: { type: String, required: true }, // mã discount
        discount_start_date: { type: Date, required: true }, // ngày bắt đầu áp dụng discount
        discount_end_date: { type: Date, required: true }, // ngày kết thúc chương trình discount
        discount_max_uses: { type: Number, required: true }, // số lượng discount của chương trình
        discount_uses_count: { type: Number, required: true }, // số discount đã sử dụng
        discount_users_used: { type: Array, default: [] }, // danh sách user đã sử dụng discount
        discount_max_uses_per_user: { type: Number, required: true }, // số lượng cho phép tối đa của 1 user
        discount_min_order_value: { type: Number, required: true }, // giá trị đơn hàng áp dụng từ ..
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" }, // shop discount

        discount_isActive: { type: Boolean, default: true }, // mã đang hoạt động
        discount_applies_to: {
            type: String,
            required: true,
            enum: ["all", "specific"],
        }, // các sản phẩm áp dụng mã.
        discount_product_ids: { type: Array, default: [] },
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
    discount: model(DOCUMENT_NAME, discountSchema),
};
