"use strict";

// config môi trường dev
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "shopDEV",
    },
};
// config kết nối môi trường PRO
const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3052,
    },
    db: {
        host: process.env.PRO_DB_HOST || "localhost",
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || "shopPRO",
    },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
// log ra màn hình môi trường mà mình đang sử dụng
console.log(config[env], env);
// mặc định db sẽ là môi trường dev
module.exports = config[env];
