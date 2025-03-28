const { gql } = require("apollo-server");

module.exports = gql`
  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String
  }

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type CategoryBreakdown {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryBreakdown!]!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type Order {
    _id: ID!
    customerId: ID!
    products: [OrderProduct]
    totalAmount: Float
    orderDate: String
    status: String
  }

  type OrderProduct {
    productId: ID!
    quantity: Int
    priceAtPurchase: Float
  }

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics

    getCustomerOrders(customerId: ID!, page: Int = 1, limit: Int = 5): [Order]
  }

  # Mutations
  type Mutation {
    placeOrder(
      customerId: ID!
      products: [OrderProductInput!]!
      totalAmount: Float!
    ): Order
  }
`;
