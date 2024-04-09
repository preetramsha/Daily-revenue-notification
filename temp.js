const currency = require('currency.js');

const USD = value => currency(value, { symbol: "$", precision: 2 });
console.log(USD(234534.5216).format());