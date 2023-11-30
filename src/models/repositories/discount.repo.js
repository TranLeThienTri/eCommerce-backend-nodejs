"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
    limit = 60,
    page = 1,
    sort = "ctime",
    filter,
    unSelect,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
    const document = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean();
    return document;
};
const findAllDiscountCodesSelect = async ({
    limit = 60,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
    const document = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    return document;
};

const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean();
};

module.exports = {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExists,
};
