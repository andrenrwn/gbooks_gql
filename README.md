# Google Books

## Description

This application is a use case example of integrating GraphQL / migrating an existing MERN application to GraphQL. This application uses Apollo Client as the front-end API for GraphQL. The back-end uses Mongoose and GraphQL + Apollo Server. Users are authenticated using JWT. JWT tokens are stored by the clientside on localstorage. Searched books on the clientside are stored in localstorage as well. The serverside will take GraphQL mutations to save books into the MongoDB database via Mongoose models. The serverside will issue and sign JWT tokens, then send it to the client; and then the server will receive JWT tokens sent from each client request to determine the session and user for any query or mutation requests.

## Repository

[https://github.com/andrenrwn/gbooks_gql](https://github.com/andrenrwn/gbooks_gql)

## Deployed application

[https://github.com/andrenrwn/gbooks_gql](https://github.com/andrenrwn/gbooks_gql)

## Install and Run

1. `$ git clone https://github.com/andrenrwn/gbooks_gql`

2. `$ npm install`

3. To run locally:\
   `$ npm run develop`

## Usage

1. Search.\
   Type in a book or book type that you want to search for in the search bar on the homepage.
   You will be presented with Google Book search results, and you can click on the link button to learn about more details about the book.

2. Sign up / Login\
   Click on Login/Signup on the top right. If you don't have an account, click on the "Sign Up" button, then create a signup username, email, and password (It does not have to be a real e-mail account for this demo). Remember the e-mail and password as this will be used for you to sign in later. You will automatically be logged in after signing up\n
   If you already signed up, you can just enter your previously created e-mail and password.


## API

Look in typeDefs.js to see the GraphQL API definitions.

Schema definitions:
- User - the user's username, email, and password, as well as a list (array) of saved books
- Book - the book details that is retrieved from Google Book's API: bookId, title, authors, description, image, link
- Auth - just a combination of the user's ID, email, and newly issued JWT token that we want to return to the client once they log in.
\
In GraphQL, queries do not change the existing state or data. Mutations are GraphQL database queries that change data, including anything that inserts/updates/delets data in the database. These GraphQL methods are implemented in resolvers.js, and therefore can be used to front-end any back-end database or combination of databases.

### Queries
1. users: [User]\
   Get a list of users

2. user(id: ID!): User\
   me: User\
   Get a specific user who is already logged in. 

### Mutations
1. addUser(username: String!, email: String!, password: String!): Auth\
   Add a user

2. login(email: String!, password: String!): Auth
   Log in an existing user, and supply a JWT token in the return value

3. addBook(bookId: String!, title: String!, authors: [String!], description: String!, image: String!, link: String!): User\
   Save a book into the user's SavedBooks list in the database

4. delBook(bookId: String!): User\
   Delete a logged-in user's book from the database

### Examples of GraphQL queries in a POST request:

Under your browser's dev tool, look for HTTP transactions to the URI '/graphql'.
The following shows an example of what Apollo Client constructs to add a book in an API call:

```
{"operationName":"addBook",
 "variables": {"bookId":"nJOakwEACAAJ",
               "title":"Summer Wars",
               "authors":["Mamoru Hosoda"],
               "description":"Directed by Mamoru Hosoda (The Girl Who Leapt Through Time), and brought to life by renowned animation studio MADHOUSE,...",
               "image":"http://books.google.com/books/content?id=nJOakwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
               "link":"http://books.google.com.sg/books?id=nJOakwEACAAJ&dq=madhouse+studio&hl=&source=gbs_api"},
 "query": "mutation addBook($bookId: String!, $title: String!, $authors: [String!], $description: String!, $image: String!, $link: String!) {
  addBook(
    bookId: $bookId
    title: $title
    authors: $authors
    description: $description
    image: $image
    link: $link
  ) {
    _id
    username
    email
    bookCount
    savedBooks {
      _id
      bookId
      title
      authors
      description
      image
      link
      __typename
    }
    __typename
  }
 }"
}

```


## Credits

The bulk of the source code used here is a MERN application created by the UT Austin Bootcamp by EdX program. This repo only created modifications of the source code to migrate from a traditional ExpressJS / Mongoose API into GraphQL. Some of the original API code is shown in comments in this repo for clarity.

MERN: MongoDB, Express JS, React, NodeJS


### Clientside libraries:
- bootstrap - CSS style library
- jwt-decode - Decode JWT tokens
- react - Front-end library to create front-end web applications
- react-bootstrap - Connector between bootstrap CSS library and React
- react-dom - Manage React components efficiently in React's virtual DOM
- react-router-dom - React library that simulates different URI pages by using the browser's history front/back and Javascript to manipulate page changes while remaining to run on the same page without actual browser window refreshes.
- graphql - Query language proxy to help organize API calls and make APIs more efficient
- @apollo/client - State management library (with caching features, etc) to manage GraphQL queries

### Server-side libraries
    bcrypt - Save only hashes of passwords in our database
    express - Express JS is the Javascript web server in which the serverside content and APIs are built upon
    jsonwebtoken - Library to create and verify JSON web tokens.
    mongoose - Front-end library for MongoDB
    graphql - GraphQL database acts like a proxy to other back-end databases like MongoDB
    @apollo/server - GraphQL API for the serverside

### Development dependencies:
- vite - Used to host a local web server to automatically transpile React code into Javascript and run it on a local development enrionrment, as well as build packed versions.

