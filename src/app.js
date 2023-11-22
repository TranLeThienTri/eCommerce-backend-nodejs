const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
require("./dbs/init.mongodb");
// const { checkOverloading } = require("./helpers/checkConnect");
// checkOverloading();
//init routes
app.use("", require("./routes"));
//handle errors
//với middleware thì sẽ có 3 tham số và error thì sẽ la 4 tham số, 3 và 4 sẽ là điều kiện để biết router đó dùng để làm gì
//404 NOT FOUND
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// hàm này dùng để check lỗi 500("Internal  server error")
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: err.stack,
        message: err.message || "Internal server error",
    });
});

module.exports = app;
