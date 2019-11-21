import styled from 'styled-components';

const OldSchoolLink = styled.a`
  margin: 2px 4px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 2px 4px;
  box-sizing: border-box;
  border-radius: 2px;
  transition: background-color 100ms ease-in-out, box-shadow 100ms ease-in-out,
    color 100ms ease-in-out;
  outline: none;
  border: none;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  color: ${props => props.theme.color.d3};

  &:hover,
  &:focus {
    background-color: ${props => props.theme.color.neutral5};
    box-shadow: 0 2px 0 ${props => props.theme.color.neutral20};
    color: ${props => props.theme.color.d2};
  }

  ${props =>
    props.active &&
    `
    background-color: ${props.theme.color.neutral5};
    box-shadow: 0 2px 0 ${props.theme.color.neutral20};
    color: ${props.theme.color.d2};
  `}

  ::after {
    display: block;
    content: attr(title);
    font-weight: bold;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
`;

export default OldSchoolLink;
