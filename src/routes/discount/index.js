"use strict";

const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authorization } = require("../../auth/authUtils");
const router = express.Router();

//get amount a discount
router.post("/amount", asyncHandle(DiscountController.getDiscountAmount));
router.get(
    "/list_product_code",
    asyncHandle(DiscountController.getAllDiscountCodesWithProduct)
);

// authentication
router.use(authorization);

router.post("", asyncHandle(DiscountController.createDiscountCode));
router.get("", asyncHandle(DiscountController.getAllDiscountCodes));

module.exports = router;
