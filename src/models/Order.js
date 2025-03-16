const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    ref: "Customer",
    required: true,
  },
  products: [
    {
      _id: false,
      productId: { type: String, ref: "Product" },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
    },
  ],
  totalAmount: Number,
  orderDate: { type: String, default: new Date().toISOString() },
  status: {
    type: String,
    enum: ["canceled", "pending", "completed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
