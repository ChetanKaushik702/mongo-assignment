const Order = require("../../models/Order");

module.exports = {
  Query: {
    async getSalesAnalytics(_, { startDate, endDate }) {
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
              $gte: new Date(startDate),
              $lte: new Date(endDate),
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
            categoryDate: [
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

      return {
        totalRevenue,
        completedOrders,
        categoryBreakdown,
      };
    },
  },
};
