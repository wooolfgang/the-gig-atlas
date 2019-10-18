import styled from 'styled-components';

export const StyledNav = styled.nav`
  padding: 0 8.3%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 67.5px;
  box-sizing: border-box;
  background: #fff;

  a {
    color: ${props => props.theme.color.d1};
    text-decoration: none;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.color.s1};
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

export const PostGigButton = styled.button`
  background: none;
  background-color: ${props => props.theme.color.p1};
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 7px 13px;
  border-radius: 2px;
  transition: background-color 0.15s;

  :hover {
    background-color: ${props => props.theme.color.p1d};
  }
`;
