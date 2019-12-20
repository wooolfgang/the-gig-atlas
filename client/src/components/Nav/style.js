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

export const SearchContainer = styled.div`
  position: relative;
  border-radius: 2px;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  background: ${props => props.theme.color.d6};
  border: 2px solid ${props => props.theme.color.d4};
  transition: all 100ms ease-out;
  outline: none;
  width: 300px;
  height: 32.5px;

  :focus-within {
    border: 2px solid ${props => props.theme.color.s2};
    box-shadow: 0 0 0;
    background-color: white;
  }
`;

export const Search = styled.input`
  border: none;
  padding: 0.4rem 0.8rem;
  box-sizing: border-box;
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  background: none;
`;

export const Badge = styled.div`
  position: absolute;
  top: -0.35rem;
  right: -0.5rem;
  background: ${props => props.theme.color.p1};
  border-radius: 2px;
  font-size: 0.4rem;
  padding: 1px 2px;
`;
