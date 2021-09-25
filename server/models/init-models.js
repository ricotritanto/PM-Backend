var DataTypes = require("sequelize").DataTypes;
var _customers = require("./customers");
var _delivery_orders = require("./delivery_orders");
var _invoice = require("./invoice");
var _products = require("./products");
var _upload_log = require("./upload_log");

function initModels(sequelize) {
  var customers = _customers(sequelize, DataTypes);
  var delivery_orders = _delivery_orders(sequelize, DataTypes);
  var invoice = _invoice(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var upload_log = _upload_log(sequelize, DataTypes);


  return {
    customers,
    delivery_orders,
    invoice,
    products,
    upload_log,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
