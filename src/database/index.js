module.exports = {
  databaseConnection: require("./connection"),
  productRepository: require("./repository/product-repo"),
  customerRepository: require("./repository/customer-repo"),
  shoppingRepository: require("./repository/shopping-repo"),
};
