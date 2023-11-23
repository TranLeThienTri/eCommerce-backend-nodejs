"use strict";
//lodash thường thì lodash sẽ kí hiệu bằng _
const _ = require("lodash");
// đưa các trường cần lấy ra trong object
const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object") removeUndefined(obj[key]);
        else if (obj[key] == null) delete obj[key];
    });
    return obj;
};

const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj || {}).forEach((k) => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response || {}).forEach((a) => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
};
