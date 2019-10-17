import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

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

  ${props =>
    props.disabled &&
    `
    opacity: 0.8;
    cursor: not-allowed;
  `}
`;

const Button = ({ children, style, type, disabled, onClick, loading }) => (
  <StyledButton style={style} type={type} disabled={disabled} onClick={onClick}>
    {children}
    {loading && <Spinner style={{ marginLeft: '5px' }} />}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape({}),
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  type: 'button',
  disabled: false,
  loading: false,
  onClick: () => {},
};

export default Button;
