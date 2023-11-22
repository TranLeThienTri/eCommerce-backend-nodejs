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

module.exports = { getInfoData, getSelectData, unGetSelectData };
