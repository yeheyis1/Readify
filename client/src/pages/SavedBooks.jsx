/* eslint-disable */
import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Fetch user data with the GET_ME query
  const { loading, error, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // Function to delete a book using the REMOVE_BOOK mutation
  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
        refetchQueries: [{ query: GET_ME }], // Refetch GET_ME to update the UI after deletion
      });
      removeBookId(bookId); // Remove book ID from local storage
    } catch (err) {
      console.error(err);
    }
  };

  // If loading, display loading message
  if (loading) return <h2>LOADING...</h2>;
  if (error) return <p>Error loading data!</p>;

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
