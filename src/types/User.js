const User = `
  type User {
    id: ID!
    name: String
    firstName: String
    description: String
    website: String
  }

  extend type Query {
    user(id: ID, username: LowercaseString): User
    currentUser: User
  }
`

module.exports = User
