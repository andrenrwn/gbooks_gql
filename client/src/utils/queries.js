import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($userId: ID!) {
    user(id: $userId) {
      _id
      username
      email
      savedBooks {
        _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Deprecated
// export const QUERY_ME = gql`
//   query me {
//     me {
//       _id
//       username
//       email
//       savedBooks {
//         _id
//         bookId
//         title
//         authors
//         description
//         image
//         link
//       }
//     }
//   }
// `;

// Mutations

// Login mutation
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Signup mutation
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Add book mutation
export const ADD_BOOK = gql`
  mutation addBook($bookId: String!, $title: String!, $authors: [String!], $description: String!, $image: String!, $link: String!) {
    addBook(bookId: $bookId, title: $title, authors: $authors, description: $description, image: $image, link: $link) {
      _id
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;

// Delete book mutation
export const DEL_BOOK = gql`
  mutation delBook($bookId: String!) {
    delBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;