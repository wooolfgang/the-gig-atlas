import styled from 'styled-components';

export const SearchContainer = styled.div`
  width: 100%;
  margin: auto;
  max-width: 100vw;
  height: 2.25rem;
  grid-area: search;
  z-index: 50;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: ${props => props.theme.color.d6};
  border: 2px solid ${props => props.theme.color.d4};
  transition: all 100ms ease-out;
  outline: none;

  :focus-within {
    border: 2px solid ${props => props.theme.color.s2};
    box-shadow: 0 0 0;
    background-color: white;
  }
`;

export const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem;
  padding: 0.35rem 0.7rem;
  outline: none;
  border: none;
  background: none;
`;
