import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #978e36c8;
  height: 80px;
  padding: 0 10px;

  > div.headerLogo{
    display: flex;
    align-items: center;
    gap: 5px;
    height: 80%;

    > img{
      height: 100%;
    }
    > span{
      font-size: 1.1rem;
    }
  }

  > nav{
    > ul{
      display: flex;
      align-items: center;
      gap: 10px;

      margin: 0;
      padding: 0;
      
      > li{
        list-style-type: none;

        > a{
          text-decoration: none;
          font-size: 1.3rem;

          &:hover{
            color: #002547;
          }
          &.active{
            color: #064077;
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const Header = () => {

  return (
    <StyledHeader>
      <div className="headerLogo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8074/8074804.png"
          alt="Library One"
        />
        <span>Library One</span>
      </div>
      <nav>
        <ul>
          <li><NavLink to=''>Home</NavLink></li>
          <li><NavLink to='books'>Books</NavLink></li>
        </ul>
      </nav>
    </StyledHeader>
  );
}

export default Header;