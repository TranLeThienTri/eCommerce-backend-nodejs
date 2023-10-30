const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

//check apiKey
router.use(apiKey);
//check permission
router.use(permission("0000"));
// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)
router.use("/v1/api", require("./access"));
// router.use("/v1/api", require("./shop"));

module.exports = router;
