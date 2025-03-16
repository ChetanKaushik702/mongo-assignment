const { gql } = require('apollo-server')

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

    type Query {
        getCustomerSpending(customerId: ID!): CustomerSpending
        getTopSellingProducts(limit: Int!): [TopProduct]
        getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    }
`