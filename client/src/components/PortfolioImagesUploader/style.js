import styled from 'styled-components';

export const Container = styled.div`
  box-sizing: border-box;
`;

export const Label = styled.label`
  border: 1px dashed ${props => props.theme.color.d3};
  display: inline-block;
  padding: 0.75rem 1.5rem;
  box-sizing: border-box;
  font-size: 0.95rem;
  cursor: pointer;

  input[type='file'] {
    display: none;
  }

  :focus,
  :active,
  :hover {
    outline: none;
    border: 1px dashed ${props => props.theme.color.s2};
  }
`;

export const ImagesContainer = styled.div`
  display: flex;
  padding: 1rem 0;
  box-sizing: border-box;
  flex-direction: column;
`;
