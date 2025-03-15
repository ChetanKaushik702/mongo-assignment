require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

(async () => {
  // Connect to MongoDB
  await connectDB();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the server
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server running at ${url}`);
  });
})();
