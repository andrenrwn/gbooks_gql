const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
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
    me: User
  }
`;

// {
//   "bookId": "3Pt7DQAAQBAJ",
//   "authors": [
//       "Eric Reinders"
//   ],
//   "title": "The Moral Narratives of Hayao Miyazaki",
//   "description": "Widely regarded as Japan's greatest animated director, Hayao Miyazaki creates films lauded for vibrant characters and meaningful narrative themes. Examining the messages of his 10 full-length films--from Nausicaa (1984) to The Wind Rises (2013)--this study analyzes each for its religious, philosophical and ethical implications. Miyazaki's work addresses a coherent set of human concerns, including adolescence, good and evil, our relationship to the past, our place in the natural order, and the problems of living in a complex and ambiguous world. Exhibiting religious influences without religious endorsement, his films urge nonjudgment and perseverance in everyday life.",
//   "image": "http://books.google.com/books/content?id=3Pt7DQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
// }

module.exports = typeDefs;
