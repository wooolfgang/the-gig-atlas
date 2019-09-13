import { css } from 'styled-components';

export const sizes = {
  xsPhone: 320,
  phone: 412,
  tablet: 768,
  desktop: 992,
  giant: 1170,
};

const media = {};

Object.keys(sizes).forEach(key => {
  media[key] = function run(...args) {
    return css`
      @media (max-width: ${sizes[key]}px) {
        ${css(...args)}
      }
    `;
  };
});

export default media;
