const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerId: String,
    amount: String,
    status: String,
    txnId: String,
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          unit: {
            type: Number,
            required: true,
          },
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);
