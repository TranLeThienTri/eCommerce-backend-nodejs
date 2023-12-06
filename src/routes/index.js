const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

//check apiKey
router.use(apiKey);

//check permission
router.use(permission("0000"));

router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
// router.use("/v1/api", require("./product"));
router.use("/v1/api/product", require("./product"));

// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)
router.use("/v1/api", require("./access"));
module.exports = router;
