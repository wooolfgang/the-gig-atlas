import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

const PrimaryStyles = css`
  background: #ffe000;
`;

const DefaultStyles = css`
  background: none;
  border: none;
`;

const SecondaryStyles = css`
  background: ${props => props.theme.color.s2};
  color: white;
`;

const BUTTON_STYLE_TYPES = {
  primary: {
    style: PrimaryStyles,
  },
  secondary: {
    style: SecondaryStyles,
  },
  default: {
    style: DefaultStyles,
  },
  link: {
    style: DefaultStyles,
  },
  submit: {
    style: PrimaryStyles,
  },
};

const StyledButton = styled.button`
  border: none;
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

  ${props => props.styleType && BUTTON_STYLE_TYPES[props.styleType].style}
`;

const Button = ({
  children,
  styleType,
  style,
  type,
  disabled,
  onClick,
  loading,
}) => {
  if (!BUTTON_STYLE_TYPES[styleType]) {
    throw new Error(
      `Unknown button type. Use one of the following types (${Object.keys(
        BUTTON_STYLE_TYPES,
      )})`,
    );
  }

  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('Invalid button type.');
  }

  return (
    <StyledButton
      style={style}
      type={type}
      disabled={disabled}
      onClick={onClick}
      styleType={styleType}
    >
      {children}
      {loading && <Spinner style={{ marginLeft: '5px' }} />}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape({}),
  type: PropTypes.string,
  styleType: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  styleType: 'default',
  type: 'button',
  disabled: false,
  loading: false,
  onClick: () => {},
};

export default Button;
