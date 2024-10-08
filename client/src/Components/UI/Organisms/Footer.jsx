import styled from "styled-components";

const StyledFooter = styled.footer`
  height: "100px";
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #978e36c8;
  padding: 45px;
  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
`;
const Footer = () => {
  return (
    <StyledFooter>
      <span>&copy;2024 by Laurynas</span>
      <div>
        <a href=""><i className="bi bi-facebook"></i> </a>
        <a href=""><i className="bi bi-instagram"></i> </a>
        <a href=""><i className="bi bi-twitter"></i> </a>
        <a href=""><i className="bi bi-youtube"></i> </a>
      </div>
      <i>Cookies</i>
      <i>Privacy Policy</i>
      <i>Terms and Uses</i>
      <span>Library address: <b>Žirmūnų g. 6, LT-09214, Vilnius</b></span>
      <div>
        <span>Hours of work: </span>
        <ul>
          <li>Monday: 8 - 22</li>
          <li>Tuesday: 8 - 22</li>
          <li>Wednesday: 8 - 22</li>
          <li>Thursday: 8 - 22</li>
          <li>Friday: 8 - 22</li>
          <li>Saturday: 8 - 21</li>
          <li>Sunday: 8 - 19</li>
        </ul>
      </div>
    </StyledFooter>
  );
}

export default Footer;