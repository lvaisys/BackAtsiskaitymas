import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import BookCard from "../UI/Organisms/BookCard"

const StyledSection = styled.section`
  >div {
    display: flex;
    flex-direction: column;
    
  > div.list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
    gap: 10px;
  }
  }
`;

const Library = () => {

  let filterString = useRef('');
  let sortString = useRef('');
  const [books, setBooks] = useState([]);
  const [formInputs, setFormInputs] = useState({
    amount_gte: '',
    publishDate_gte: '',
    publishDate_lte: '',
    pages_gte: '',
    pages_lte: '',
    rating_gte: '',
    rating_lte: '',
    title: '',
    genres_in: [],
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const getPageSizeData = (skip) => {
    fetch(`http://localhost:5501/books?${filterString.current}&${sortString.current}&limit=10&skip=${skip}`)
      .then(res => res.json())
      .then(data => setBooks(data))
  }

  const changePage = (direction) => {
    const nextpage = currentPage + direction;
    setCurrentPage(nextpage);
    getPageSizeData(
      (nextpage) * 10
    );
  }

  useEffect(() => {
    getPageSizeData(currentPage);
    fetch(`http://localhost:5501/totalCount?${filterString.current}`)
      .then(res => res.json())
      .then(data => setTotalAmount(data.totalAmount));
  }, []);

  const formInputControl = (e) => {
    if (e.target.type === 'checkbox') {
      if (e.target.id === 'have') {
        setFormInputs({
          ...formInputs,
          [e.target.name]: e.target.checked ? 1 : 0
        })
      } else if (e.target.checked === true) {
        setFormInputs({
          ...formInputs,
          [e.target.name]: [...formInputs.genres_in, e.target.value]
        });
      } else {
        setFormInputs({
          ...formInputs,
          [e.target.name]: formInputs.genres_in.filter(genre => genre !== e.target.value)
        });
      }
    } else {
      setFormInputs({
        ...formInputs,
        [e.target.name]: e.target.type === 'number' ? e.target.valueAsNumber : e.target.value
      });
    }
  }

  const fetchOrdered = (e) => {
    sortString.current = `sort_${e.target.value}`;
    fetch(`http://localhost:5501/books?${filterString.current}&${sortString.current}&limit=10&skip=${currentPage * 10}`)
      .then(res => res.json())
      .then(data => setBooks(data))
  }

  const fetchFiltered = (e) => {
    e.preventDefault();
    filterString.current = '';
    Object.keys(formInputs).forEach(key => {
      if (formInputs[key]) {
        if (key === 'imdbRating_lte') {
          filterString.current += `filter_imdb.rating_lte=${formInputs[key]}&`;
        } else if (key === 'imdbRating_gte') {
          filterString.current += `filter_imdb.rating_gte=${formInputs[key]}&`;
        } else if (key === 'genres_in') {
          if (formInputs.genres_in.length > 0) {
            filterString.current += `filter_${key}=${formInputs[key].join(',')}`;
          }
        } else {
          filterString.current += `filter_${key}=${formInputs[key]}&`;
        }
      }
    });
    fetch(`http://localhost:5501/books?${filterString.current}&${sortString.current}&limit=10&skip=${currentPage * 10}`)
      .then(res => res.json())
      .then(data => setBooks(data));
    fetch(`http://localhost:5501/totalCount?${filterString.current}&${sortString.current}`)
      .then(res => res.json())
      .then(data => setTotalAmount(data.totalAmount));
    setCurrentPage(0);
  }

  return (
    <StyledSection>
      <div>
        <div>
          <h4>Filtering</h4>
          <form onSubmit={fetchFiltered}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title" name="title"
                value={formInputs.title}
                onChange={formInputControl}
              />
            </div>
            <div>
              <fieldset>
                <legend>Select the genres:</legend>
                <div>
                  <label htmlFor="education">Education</label>
                  <input
                    type="checkbox"
                    name="genres_in" id="education"
                    value="Education"
                    onChange={formInputControl}
                  />
                </div>
                <div>
                  <label htmlFor="history">History</label>
                  <input
                    type="checkbox"
                    name="genres_in" id="history"
                    value="History"
                    onChange={formInputControl}
                  />
                </div>
                <div>
                  <label htmlFor="biography">Biography</label>
                  <input
                    type="checkbox"
                    name="genres_in" id="biography"
                    value="Biography"
                    onChange={formInputControl}
                  />
                </div>
                <div>
                  <label htmlFor="psychological">Psychological</label>
                  <input
                    type="checkbox"
                    name="genres_in" id="psychological"
                    value="Psychological"
                    onChange={formInputControl}
                  />
                </div>
              </fieldset>
            </div>
            <div>
              <label htmlFor="publishDate_gte">Year from:</label>
              <input
                type="number"
                id="publishDate_gte" name="publishDate_gte"
                max={formInputs.publishDate_lte}
                value={formInputs.publishDate_gte}
                onChange={formInputControl}
              />
            </div>
            <div>
              <label htmlFor="publishDate_lte">Year to:</label>
              <input
                type="number"
                id="publishDate_lte" name="publishDate_lte"
                min={formInputs.publishDate_gte}
                value={formInputs.publishDate_lte}
                onChange={formInputControl}
              />
            </div>
            <div>
              <label htmlFor="haveOne">Have at least one in stock:</label>
              <input
                type="checkbox"
                name="amountOfCopies_gte" id="have"
                value="1"
                onChange={formInputControl}
              />
            </div>
            <input type="submit" value="Filter" />
          </form>
        </div>
        <div>
          <h4>Sorting</h4>
          <button
            value={'pages=1'}
            onClick={fetchOrdered}
          >Page count ASC</button>
          <button
            value={'pages=-1'}
            onClick={fetchOrdered}
          >Page count DESC</button>
          <button
            value={'publishDate=1'}
            onClick={fetchOrdered}
          >Year ASC</button>
          <button
            value={'publishDate=-1'}
            onClick={fetchOrdered}
          >Year DESC</button>
          <button
            value={'rating=1'}
            onClick={fetchOrdered}
          >Rating ASC</button>
          <button
            value={'rating=-1'}
            onClick={fetchOrdered}
          >Rating DESC</button>
        </div>
      </div>
      <div>

        <div className="list">
          {
            books?.map(el =>
              <BookCard
                key={el._id}
                data={el}
              />
            )
          }
        </div>
        <div>
          {
            totalAmount > 0
              ? <>
                <button
                  disabled={!currentPage}
                  onClick={() => changePage(-1)}
                >Previous Page</button>
                <span>Page {currentPage + 1} of {totalAmount % 10 > 0 ? Math.trunc(totalAmount / 10) + 1 : Math.trunc(totalAmount / 10)}</span>
                <button
                  disabled={(currentPage + 1) * 10 >= totalAmount}
                  onClick={() => changePage(1)}
                >Next Page</button>
              </>
              : <></>
          }
        </div>
      </div>
    </StyledSection>
  );
}

export default Library;