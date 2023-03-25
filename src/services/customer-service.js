const { customerRepository } = require("../database/index");
const {
  formatData,
  hashPassword,
  validatePassword,
  generateSignature,
  validatePassword,
} = require("../utils/index");

const { APIError, BadRequestError } = require("../utils/app-errors");

// All business logic will be here
class CustomerService {
  constructor() {
    this.repository = new customerRepository();
  }

  async signIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.findOne({ email: email });

      if (existingCustomer) {
        const checkIfPassValid = await validatePassword(
          password,
          existingCustomer.password
        );

        if (checkIfPassValid) {
          const token = await generateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });

          return formatData({ id: existingCustomer._id, token });
        }
      }
      return formatData(null);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async signUp(userInputs) {
    const { email, password, phone } = userInputs;
    try {
      let hashedPassword = await hashPassword(password);

      const createUser = await this.repository.CreateCustomer({
        email: email,
        password: hashedPassword,
        phone: phone,
      });

      const token = await generateSignature({
        email: createUser.email,
        _id: createUser._id,
      });

      return formatData({ id: createUser._id, token });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async addNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;
    try {
      const data = await this.repository.CreateAddress({
        _id: _id,
        street: street,
        postalCode: postalCode,
        city: city,
        country: country,
      });

      return formatData(data);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async getProfile(id) {
    try {
      const data = await this.repository.FindCustomerByEmail({ id });

      if (data) {
        return formatData(data);
      } else {
        return formatData({ msg: "Error" });
      }
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async getShoppingDetails(id) {
    try {
      const data = await this.repository.FindCustomerById({ id });

      if (data) {
        return formatData(data);
      } else {
        return formatData({ msg: "Error" });
      }
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async getWishList(customerId) {
    try {
      const wishListItems = await this.repository.Wishlist(customerId);

      return formatData(wishListItems);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async addToWishlist(customerId, product) {
    try {
      const wishList = await this.repository.AddWishlistItem(
        customerId,
        product
      );

      return formatData(wishList);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async manageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );

      return formatData(cartResult);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async manageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );

      return formatData(orderResult);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async subscribeEvents(payload) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.addToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.manageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;