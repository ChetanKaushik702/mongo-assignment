const Order = require("../../models/Order");

module.exports = {
  Query: {
    async getCustomerSpending(_, { customerId }) {
      const customerOrders = await Order.aggregate([
        { $match: { customerId: customerId } },
        {
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$totalAmount" },
            lastOrderDate: { $max: "$orderDate" },
            averageOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]);
      if (customerOrders.length === 0) {
        return {
          customerId,
          totalSpent: 0,
          averageOrderValue: 0,
          lastOrderDate: null,
        };
      }
      const { totalSpent, averageOrderValue, lastOrderDate } =
        customerOrders[0];
      return {
        customerId,
        totalSpent,
        averageOrderValue,
        lastOrderDate,
      };
    },
  },
};
