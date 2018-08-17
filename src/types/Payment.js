// @flow
const Payment = /* GraphQL */`
  input AlipayInput {
    paymentPlanId: ID!
  }

  extend type Mutation {
    payWithAlipay(input: AlipayInput!): String!
  }
`

module.exports = Payment