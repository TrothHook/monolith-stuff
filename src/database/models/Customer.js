const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isEmail, "email is invalid"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
    },
    salt: String,
    phone: String,
    address: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
        required: [true, "address is required"],
      },
    ],
    cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("customer", customerSchema);
