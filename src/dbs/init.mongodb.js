"use strict";
const mongoose = require("mongoose");

const {
    db: { port, host, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnections } = require("../helpers/checkConnect");
console.log("ConnectString::", connectString);

class Database {
    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        // môi trường dev
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString, { maxPoolSize: 50 })
            .then((_) => {
                console.log(`Connect mongodb success::`, countConnections());
            })
            .catch((err) => console.log(`Connect with mongodb error: ${err}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
