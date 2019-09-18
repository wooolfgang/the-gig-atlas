import { css } from 'styled-components';

export const color = {
  /* primary colors */
  p1: '#FFE000',
  p2: 'rgb(255,244,0, 20%)',

  /* secondary colors */
  s1: '#183DBD',

  /* dark colors from darkest to lightest */
  d1: '#000000',
  d2: '#333333',
  d3: '#C4C4C4',
  d4: '#E5E5E5',
  d5: '#F6F6F4',
  d6: '#FAFAFA',
  d7: '#FFFFFF',

  /* error colors */
  e1: '#cc0000',
};

const theme = {
  color,
};

export const InputStyles = css`
  box-sizing: border-box;
  font-size: 1rem;
  border: none;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: ${props => props.theme.color.d6};
  border: 1px solid ${props => props.theme.color.d4};

  ${props =>
    props.selected &&
    `
    outline: 0;
    border: 1px solid ${props.theme.color.s1};
  `}

  :hover,
  :focus {
    outline: 0;
    border: 1px solid ${props => props.theme.color.s1};
  }
`;

export default theme;
