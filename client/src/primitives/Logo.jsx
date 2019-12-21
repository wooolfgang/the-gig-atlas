import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.img`
  width: 48px;
`;

const Logo = () => <StyledLogo src="/static/logo.svg" alt="logo" />;

export default Logo;
