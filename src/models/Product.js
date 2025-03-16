const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: Number,
  stock: Number,
});

module.exports = mongoose.model("Product", productSchema);
