const { customerModel, addressModel } = require("../models/index");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

// Dealing with database operations

class CustomerRepository {
  async CreateCustomer({ email, password, phone }) {
    try {
      const user = new customerModel({
        email: email,
        password: password,
        phone: phone,
      });

      const signedInUser = await user.save();

      return signedInUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to sign in"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const existingCustomer = await customerModel.findOne({ _id: _id });

      if (existingCustomer) {
        const createAddress = new addressModel({
          street: street,
          postalCode: postalCode,
          city: city,
          country: country,
        });

        await createAddress.save();

        existingCustomer.address.push(createAddress);
      }

      return await existingCustomer.save();
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create a new address"
      );
    }
  }

  async FindCustomerByEmail({ email }) {
    try {
      const user = await customerModel.findOne({ email });

      return user;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error! Unable to find customer"
      );
    }
  }

  async FindCustomerById({ id }) {
    try {
      const user = await customerModel
        .findOne({ _id: id })
        .populate("address")
        .populate("wishlist")
        .populate("orders")
        .populate("cart-product");

      return user;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error! Unable to find customer"
      );
    }
  }

  async Wishlist(customerId) {
    try {
      const user = await customerModel
        .findOne({ _id: customerId })
        .populate("wishlist");

      return user.wishlist;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to get wishlist"
      );
    }
  }

  async AddWishlistItem(customerId, product) {
    try {
      const user = await customerModel
        .findOne({ _id: customerId })
        .populate("wishlist");

      if (user) {
        let wishlist = user.wishlist;
        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }

        user.wishlist = wishlist;
      }

      const userResult = await user.save();

      return userResult.wishlist;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to wishlist"
      );
    }
  }

  async AddCartItem(customerId, product, qty, isRemove) {
    try {
      const user = await customerModel
        .findOne({ _id: customerId })
        .populate("cart.product");

      if (user) {
        const cartItem = {
          product: product,
          unit: qty,
        };

        let cartItems = user.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (item.product._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        user.cart = cartItem;

        const cartSaveResult = await user.save();

        return cartSaveResult.cart;
      }

      throw new Error("Unable to add to cart");
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to cart"
      );
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await customerModel.findById(customerId);

      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);

        profile.cart = [];

        const profileResult = await profile.save();

        return profileResult;
      }

      throw new Error("Unable to add to order!");
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }
}
