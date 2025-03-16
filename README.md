# Mongo + GraphQL + Node.js Assignment

## Overview
This project is a take-home assignment that demonstrates how to build a GraphQL API with **MongoDB**, **GraphQL**, and **Node.js** using **Mongoose**. The API provides e-commerce analytics endpoints for:

- Retrieving customer spending details.
- Fetching top-selling products.
- Getting sales analytics by product category for a date range.
- Retrieving a paginated list of orders for a customer.
- Placing an order via a GraphQL mutation.

> **Note:** The `orderDate` field is stored as an ISO string (e.g., `"2025-03-16T07:38:24.356Z"`) in the database.

## Features
- **GraphQL API** using Apollo Server.
- **MongoDB Aggregation Pipelines** for analytics.
- **Mongoose Models** for `Customer`, `Product`, and `Order` (with `orderDate` stored as an ISO string).
- **CSV Seed Data** to import sample customers, products, and orders.
- **Bonus Challenges:**
  - Mutation for placing an order.
  - Pagination support for retrieving customer orders.
  - Redis caching for sales analytics queries.

## Prerequisites
- [Node.js (v14+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or remote)
- [Redis](https://redis.io/) (for caching)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mongo-graphql-assignment.git
cd mongo-graphql-assignment
