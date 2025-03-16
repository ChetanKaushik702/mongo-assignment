const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
    },
  ],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["canceled", "pending", "completed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
