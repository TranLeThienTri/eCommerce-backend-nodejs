"use strict";

const express = require("express");
const CartController = require("../../controllers/cart.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authorization } = require("../../auth/authUtils");
const router = express.Router();

router.post("", asyncHandle(CartController.addToCart));
router.delete("", asyncHandle(CartController.delete));
router.post("/update", asyncHandle(CartController.update));
router.get("", asyncHandle(CartController.listToCart));
module.exports = router;
