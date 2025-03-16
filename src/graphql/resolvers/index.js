const customerResolvers = require('../resolvers/customerResolvers');
const productResolvers = require('../resolvers/productResolvers');
const orderResolvers = require('../resolvers/orderResolvers');

module.exports = {
    Query: {
        ...customerResolvers.Query,
        ...productResolvers.Query,
        ...orderResolvers.Query,
    }
}