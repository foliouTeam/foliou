'use strict';

var a = require('./a');
require('jquery');

var B = function (params) {
    console.log(a.a);
    return params
};

module.exports = B;
