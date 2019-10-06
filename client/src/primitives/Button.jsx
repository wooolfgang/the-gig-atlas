import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  border: none;
  background: #ffe000;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  display: flex;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Button = ({ children, style, type }) => (
  <StyledButton style={style} type={type}>
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape({}),
  type: PropTypes.string,
};

Button.defaultProps = {
  style: {},
  type: 'button',
};

export default Button;
