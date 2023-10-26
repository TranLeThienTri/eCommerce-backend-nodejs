const express = require("express");

const router = express.Router();

// router.get("", (req, res, next) => {
//     return res.status(200).json({
//         msg: "Welcom to Nodejs",
//     });
// });

router.use("/v1/api", require("./access"));
// router.use("/v1/api", require("./shop"));

module.exports = router;
