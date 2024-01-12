import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

// import { getMe, deleteBook } from "../utils/API";
import { deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

// Use Apollo GraphQL query method
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_USER } from "../utils/queries";

const SavedBooks = () => {
  const userId = Auth.getUser().data._id;
  console.log("Savedbooks token user id:", userId);

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { userId },
    fetchPolicy: "no-cache",
  });
  console.log("getUserData's loading:", loading, " data: ", data);

  let userData;

  if (data && data.hasOwnProperty("user")) {
    userData = data.user;
  }

  // Don't need to use useEffect for Apollo graphQL queries because it seems to already be asynchronous
  // useEffect(() => {
  //   console.log("savedbooks useeffect");
  // }, [userData]);

  // const userDataLength = Object.keys(userData).length;
  //-----------------------------------
  // // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // console.log("Savedbooks userdata:", userData);
  // console.log("Savedbooks Auth.getuser:", Auth.getUser());

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       console.log("getuserdata's token: ", token);
  //       if (!token) {
  //         return false;
  //       }

  //       // Old API method to get current user data
  //       // const response = await getMe(token);

  //       // if (!response.ok) {
  //       //   throw new Error('something went wrong!');
  //       // }

  //       // const user = await response.json();

  //       const { loading, data } = useQuery(QUERY_USER, {
  //         variables: { userId },
  //         fetchPolicy: "no-cache",
  //       });
  //       console.log("getUserData's loading:", loading, " data: ", data);

  //       const userId = Auth.getUser().data._id;
  //       console.log("Savedbooks token user id:", userId);

  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   // getUserData();
  // }, [testState, loading]);

  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return (
      <>
        <h2>LOADING...</h2>
      </>
    );
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <Button className="btn-block btn-danger" onClick={() => handleClickForUser()}>
          Get User!
        </Button>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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
