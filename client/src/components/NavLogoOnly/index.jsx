import React from 'react';
import { StyledNav, LogoContainer } from '../Nav/style';
import { NavLink, Logo } from '../../primitives';

const NavLogoOnly = () => (
  <StyledNav>
    <NavLink href="/">
      <LogoContainer>
        <Logo />
      </LogoContainer>
    </NavLink>
    <div />
  </StyledNav>
);

export default NavLogoOnly;
