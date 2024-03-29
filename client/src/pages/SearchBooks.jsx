import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
// import { saveBook, searchGoogleBooks } from "../utils/API"; // saveBook is deprecated
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

// Include GraphQL Apollo client
import { useMutation } from "@apollo/client";

// include GraphQL static queries templates
import { ADD_BOOK } from "../utils/queries";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [addBook, { error }] = useMutation(ADD_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        link: book.volumeInfo.infoLink || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // console.log("Book to save:", bookToSave); // debug log

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // Bypass book save if there is no token found
    if (!token) {
      return false;
    }

    try {
      // //Old API call to save book. Deprecated.
      // const response = await saveBook(bookToSave, token);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // New API method using GraphQL / Apollo

      // Initialize all required GraphQL mutation query parameter elements to at least null, even if they are not defined in BookToSave
      //   This is done because GraphQL requires all the predefined object keys defined in its mutation, if they don't exist, they must be null.
      //   addBook(bookId: String!, title: String!, authors: [String!], description: String!, image: String!, link: String!): Book
      let bookVariables = Object.assign(
        {
          bookId: "",
          title: "",
          authors: [],
          description: "",
          image: "",
          link: "",
        },
        bookToSave
      );
      const { data } = await addBook({
        variables: { ...bookVariables },
      });

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length ? `Viewing ${searchedBooks.length} results:` : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <div className="d-flex flex-column">
                      <Button className="btn btn-primary btn-sm align-self-start mb-2" href={book.link} alt={book.link} target="_blank" role="button">Link</Button>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                          className="btn-block btn-info align-self-start"
                          onClick={() => handleSaveBook(book.bookId)}
                        >
                          {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                            ? "This book has already been saved!"
                            : "Save this Book!"}
                        </Button>
                      )}
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

export default SearchBooks;
