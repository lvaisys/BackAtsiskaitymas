import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
`;

const SpecificBook = () => {

  const { id } = useParams();
  const [book, setBook] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5501/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data));
  }, []);

  return (
    <StyledSection>
      {
        book ?
          <>
            <div>
              <h2>{book.title}</h2>
              <p>Author: <b>{book.author}</b></p>
              <p>Genres: <b>{book.genres}</b></p>
              <p>{book.description}</p>
              <h3>Publish Date: {book.publishDate}</h3>
              <h3>Rating: {book.rating}</h3>
              <h3>Pages: {book.pages}</h3>
              <h3>Amount of copies in stock: {book.amountOfCopies}</h3>
            </div>
            <div>
              <img src={book.imageUrl} alt={book.title} />
            </div>
          </> : null
      }
    </StyledSection>
  );
}

export default SpecificBook;