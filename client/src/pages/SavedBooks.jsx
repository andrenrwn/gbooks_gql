import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

// Use Apollo GraphQL query method
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { QUERY_USER, DEL_BOOK } from "../utils/queries";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  let userData;

  const userId = Auth.getUser().data._id;
  console.log("Savedbooks token user id:", userId);

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { userId },
    fetchPolicy: "no-cache",
  });
  console.log("getUserData's loading:", loading, " data: ", data);

  // populate userData
  if (data && data.user) {
    userData = data.user;
  }

  let userDataLength;
  if (userData) {
    userDataLength = Object.keys(userData).length;
  }

  // Add a useMutation hook for book deletions
  const [delBook, { error }] = useMutation(DEL_BOOK);

  // useEffect(() => {}, []); // Deprecated

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Old API method to delete book - deprecated
      // const response = await deleteBook(bookId, token);

      // if (!response.ok) {
      //   throw new Error("something went wrong!");
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);

      const { data } = await delBook({
        variables: { bookId },
      });

      if (data && data.delBook) {
        console.log("========================== DEL BOOK RESULT DATA ======================", data.delBook);
        // upon success, remove book's id from localStorage
        userData = data.delBook;
        // setUserData(data.delBook);
        removeBookId(bookId);

        // unsure how to get react to re-render as useState caused an infinite loop, so work-around with window.location.reload() instead.
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading || !userDataLength) {
    return (
      <>
        <h2>LOADING...</h2>
      </>
    );
  }

  // The following "fluid" keyword generated this error:
  // warning: Received `true` for a non-boolean attribute `fluid`.
  // If you want to write it to the DOM, pass a string instead: fluid="true" or fluid={value.toString()}.
  //     at div
  //     at SavedBooks (http://localhost:3009/src/pages/SavedBooks.jsx?t=1705069610095:30:29)

  return (
    <>
      <div className="text-light bg-dark p-5" fluid="true">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.bookCount
            ? `Viewing ${userData.bookCount} saved ${userData.bookCount === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <div className="d-flex flex-column">
                      {book.link && (
                        <Button href={book.link} className="btn-sm align-self-start mb-2" alt={book.link} target="_blank" role="button">Link</Button>
                      )}
                      <Button className="btn-block btn-danger align-self-start" onClick={() => handleDeleteBook(book.bookId)}>
                        Delete this Book!
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
