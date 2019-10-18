import { css } from 'styled-components';

export const color = {
  /* primary colors */
  p1: '#FFE000',
  p1d: '#eed100',
  p2: 'rgb(255,244,0, 20%)',

  /* secondary colors */
  s1: '#183DBD',
  s2: '#3568fc',
  s3: '#1a73e8;',

  /* dark colors from darkest to lightest */
  d1: '#333333',
  d2: '#4f4f4f',
  d3: '#5f5f5f',
  d4: '#E5E5E5',
  d5: '#F6F6F4',
  d6: '#FAFAFA',
  d7: '#FFFFFF',

  /* error colors */
  e1: '#cc0000',

  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)',
};

const theme = {
  color,
};

export const InputStyles = css`
  box-sizing: border-box;
  font-size: 1rem;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: ${props => props.theme.color.d6};
  border: 1px solid ${props => props.theme.color.d4};
  min-height: 2em;
  outline: 0;
  transition: all 100ms;

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: rgba(0, 0, 0, 0.247);
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: rgba(0, 0, 0, 0.247);
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: rgba(0, 0, 0, 0.247);
  }

  :-moz-placeholder {
    color: rgba(0, 0, 0, 0.247);
    /* Firefox 18- */
  }

  ${props =>
    props.hasError &&
    `
    border: 1px solid ${props.theme.color.e1} !important;
  `}

  ${props =>
    props.selected &&
    `
    border: 1px solid ${props.theme.color.s3};
  `}

  &:focus {
    border: 1px solid ${props => props.theme.color.s3};
  }
`;

export default theme;
