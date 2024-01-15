const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(bookId: String!, title: String!, authors: [String!], description: String!, image: String!, link: String!): User
    delBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
