const { v4: uuidv4 } = require("uuid");
const { customerModel, productModel, orderModel } = require("../models/index");

const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

// Dealing with data base operations

class ShoppingRepository {
  // payment
  async Orders(customerId) {
    try {
      return await orderModel
        .findOne({ customerId: customerId })
        .populate("items.product");
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to fetch the orders for customer ${customerId}`
      );
    }
  }

  async CreateOrder(customerId, txnId) {
    try {
      const profile = await customerModel
        .findOne({ _id: customerId })
        .populate("cart.product");

      if (profile) {
        let amount = 0;
        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          cartItems.map((eachItem) => {
            amount += eachItem.price * eachItem.unit;
          });

          const orderId = uuidv4();

          const order = new orderModel({
            orderId: orderId,
            customerId: customerId,
            amount: amount,
            txnId: txnId,
            status: "received",
            items: cartItems,
          });

          profile.cart = [];

          order.populate("items.product").execPopulate();
          const orderResult = await order.save();

          profile.orders.push(orderResult);

          await profile.save();

          return orderResult;
        }
      }
      return {
        msg: "error",
        data: {},
      };
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create new order"
      );
    }
  }
}

module.exports = ShoppingRepository;
