"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authorization } = require("../../auth/authUtils");
const router = express.Router();

//search by user
router.get(
    "/search/:keySearch",
    asyncHandle(productController.getListSearchProduct)
);
router.get("", asyncHandle(productController.findAllProducts));
router.get("/:product_id", asyncHandle(productController.findProduct));

// authentication
router.use(authorization);
//logout
router.post("", asyncHandle(productController.createProduct));
router.post("/publish/:id", asyncHandle(productController.publicProductByShop));
router.post(
    "/unpublish/:id",
    asyncHandle(productController.unPublishProductByShop)
);

// QUERY //
router.get("/drafts/all", asyncHandle(productController.getAllDraftsForShop));
router.get("/publish/all", asyncHandle(productController.getAllPublishForShop));

module.exports = router;
