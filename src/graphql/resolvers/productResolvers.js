const Product = require("../../models/Product");
const Order = require("../../models/Order");

module.exports = {
  Query: {
    async getTopSellingProducts(_, { limit }) {
      const topSellingProducts = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productId: "$productInfo._id",
            name: "$productInfo.name",
            totalSold: 1,
          },
        },
      ]);
      return topSellingProducts;
    },
  },
};
