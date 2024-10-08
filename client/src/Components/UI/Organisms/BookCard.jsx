import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledDiv = styled.div`
  flex: 1 1 400px;
  width: 700px;

  padding: 10px 20px;
  border: 1px solid black;
  
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

const BookCard = ({ data }) => {
  return (
    <StyledDiv>
      <h2>{data.title}</h2>
      <p >{data.description.length <= 60 ? data.description : data.description.substring(0, 200)}</p>
      <h3>{data.author}</h3>
      <h3>Genres: 
      {
          data.genres?.map(el =>
            <span key={el}> {el }; </span>
          )
        }
      </h3>
      <h3>{data.publishDate}</h3>
      <Link to={data._id} target='_blank'>Read more</Link>
    </StyledDiv>
  );
}
 
export default BookCard;