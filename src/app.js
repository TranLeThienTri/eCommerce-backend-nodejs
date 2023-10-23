const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init db

//init routes
app.get("/", (req, res, next) => {
    const strCompress = "Hello, world!";
    return res.status(200).json({
        msg: "Welcom to nodejs",
        metadata: strCompress.repeat(100000),
    });
});
//handle errors

module.exports = app;