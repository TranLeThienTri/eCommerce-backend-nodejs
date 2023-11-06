"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandle } = require("../../helpers/asyncHandler");
const { authorization } = require("../../auth/authUtils");
const router = express.Router();

//async fn

//SignUp
router.post("/shop/signup", asyncHandle(accessController.signUp));
//login
router.post("/shop/login", asyncHandle(accessController.login));

// authentication
router.use(authorization);
//logout
router.post("/shop/logout", asyncHandle(accessController.logout));

module.exports = router;
