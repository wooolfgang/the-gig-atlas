import { createGlobalStyle } from 'styled-components';
import { color } from './theme';
import media from './media';

export default createGlobalStyle`
  :root {
    font-size: 16px;
    color: ${color.d1};

    ${media.phone`
      font-size: 14px;
    `}
  }
 
  body {
    margin: 0px;
    padding: 0px;
    background: #ffffff; 
    -webkit-font-smoothing: antialiased; 
    -moz-osx-font-smoothing: grayscale; 
    text-rendering: optimizeLegibility;
    font-family: 'Inter', -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;

  }

  h1 { 
    font-size: 2em;
    font-weight: 600;
  }
  h2 { 
    font-size: 1.5em;
    font-weight: 600;
   }
  h3 { 
    font-size: 1.17em; 
    font-weight: 600;
  }
  h4 { 
    font-size: 1.12em;
    font-weight: 600;
  }
  h5 { 
    font-size: .83em; 
    font-weight: 600;
  }
  h6 { 
    font-size: .75em; 
    font-weight: 600;
  }
  a,span,p {
    font-size: 1rem;
  }
`;
