"use strict";
//lodash thường thì lodash sẽ kí hiệu bằng _
const _ = require("lodash");
// đưa các trường cần lấy ra trong object
const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
};
module.exports = { getInfoData };
