import React from 'react';
import { StyledNav, NavLinks, PostGigButton, LogoContainer } from './style';
import { NavLink, Logo } from '../../primitives';

const NavLoginSignup = () => (
  <StyledNav>
    <NavLink href="/">
      <LogoContainer>
        <Logo />
      </LogoContainer>
    </NavLink>
    <NavLinks>
      <NavLink href="/auth/signin" style={{ marginRight: '.9rem' }}>
        Login
      </NavLink>
      <NavLink href="/auth/signup">
        <PostGigButton>Signup</PostGigButton>
      </NavLink>
    </NavLinks>
  </StyledNav>
);

export default NavLoginSignup;
