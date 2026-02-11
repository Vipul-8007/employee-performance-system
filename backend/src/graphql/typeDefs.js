const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # USERS
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # PERFORMANCE
  type Performance {
    id: ID!
    employee: User!
    evaluator: User!
    rating: Int!
    skillLevel: Int!
    attendanceScore: Int!
    currentSalary: Float!
    hikePercentage: Float
    revisedSalary: Float
    promotionRecommendation: String
    performanceSummary: String
    createdAt: String
  }

  # HR OVERVIEW TYPE
  type HRView {
    employee: User!
    performance: Performance
  }

  # QUERIES
  type Query {
    hello: String
    me: User

    # Manager / HR
    employees: [User!]!

    # Employee
    myPerformance: [Performance!]!

    # Manager / HR
    employeePerformance(employeeId: ID!): [Performance!]!

    #HR Dashboard Overview
    hrEmployeeOverview: [HRView!]!
  }

  # MUTATIONS
  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      role: String!
      companyCode: String
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    evaluatePerformance(
      employeeId: ID!
      rating: Int!
      skillLevel: Int!
      attendanceScore: Int!
      currentSalary: Float!
    ): Performance!
  }
`;

module.exports = typeDefs;
