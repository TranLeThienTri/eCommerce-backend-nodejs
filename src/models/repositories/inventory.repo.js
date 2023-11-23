"use strict";

const { inventory } = require("../inventory.model");

const insertInventory = async ({
    productId,
    stock,
    location = "unKnow",
    shopId,
}) => {
    return inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shopId,
    });
};

module.exports = {
    insertInventory,
};
