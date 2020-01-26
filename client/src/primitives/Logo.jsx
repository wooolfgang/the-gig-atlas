import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.img`
  width: 3.15rem;
`;

const Logo = () => <StyledLogo src="/static/logo.svg" alt="logo" />;

export default Logo;
