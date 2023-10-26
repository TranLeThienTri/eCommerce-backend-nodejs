"use strict";
const os = require("os");
const mongoose = require("mongoose");
// count connections
const _SECONDS = 5000;
const countConnections = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
};

//check overloading
const checkOverloading = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        //
        const maximumConnect = numConnect * 5;
        console.log(`Active connections: ${numConnect}`);
        console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

        // kiểm tra nếu mà số lượng connections lớn hơn số lượng mà server cho phép thì bắn log
        if (numConnect > maximumConnect) {
            console.log("Connect overloading detected");
        }
    }, _SECONDS);
};

module.exports = { countConnections, checkOverloading };
