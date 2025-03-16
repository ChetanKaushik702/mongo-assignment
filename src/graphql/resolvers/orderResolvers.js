const Order = require("../../models/Order");
const redis = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  Query: {
    async getSalesAnalytics(_, { startDate, endDate }) {
      const cacheKey = `salesAnalytics:${startDate}:${endDate}`;
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit!");
        return JSON.parse(cachedData);
      }
      /**
       * This aggregation does the following:
       * 1. Filters orders by "completed" status and the specified date range.
       * 2. Uses $facet to split into two pipelines:
       *    a) `overall`: sums total revenue (totalAmount) and counts completed orders.
       *    b) `categoryData`: breaks down revenue by product category.
       *
       * For the category breakdown, we:
       *  - Unwind the products array in each order
       *  - Lookup the product document to fetch its category
       *  - Sum (quantity * priceAtPurchase) per category
       */
      const [analytics] = await Order.aggregate([
        {
          $match: {
            status: "completed",
            orderDate: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$totalAmount" },
                  completedOrders: { $sum: 1 },
                },
              },
            ],
            categoryData: [
              { $unwind: "$products" },
              {
                $lookup: {
                  from: "products",
                  localField: "products.productId",
                  foreignField: "_id",
                  as: "productRef",
                },
              },
              { $unwind: "$productRef" },
              {
                $group: {
                  _id: "$productRef.category",
                  revenue: {
                    $sum: {
                      $multiply: [
                        "$products.quantity",
                        "$products.priceAtPurchase",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      // Extract overall analytics
      const overall = analytics.overall.length ? analytics.overall[0] : null;
      const totalRevenue = overall ? overall.totalRevenue : 0;
      const completedOrders = overall ? overall.completedOrders : 0;

      // Build the category breakdown array
      const categoryBreakdown = analytics.categoryData.map((item) => ({
        category: item._id,
        revenue: item.revenue,
      }));

      const result = {
        totalRevenue,
        completedOrders,
        categoryBreakdown,
      };

      await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 5);

      return result;
    },
    async getCustomerOrders(_, { customerId, page = 1, limit = 5 }) {
      const orders = await Order.find({ customerId })
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return orders;
    },
  },

  Mutation: {
    async placeOrder(_, { customerId, products, totalAmount }) {
      const order = new Order({
        _id: uuidv4(),
        customerId,
        products,
        totalAmount,
        orderDate: new Date().toISOString(),
        status: "completed",
      });

      await order.save();
      return order;
    },
  },
};
