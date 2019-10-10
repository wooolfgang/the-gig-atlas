import React from 'react';
import {
  StyledNav,
  NavLinks,
  LogoContainer,
  PostGigButton,
} from '../Nav/style';
import { NavLink, Logo } from '../../primitives';

const NavLoginSignup = () => (
  <StyledNav>
    <NavLink href="/">
      <LogoContainer>
        <Logo />
      </LogoContainer>
    </NavLink>
    <NavLinks>
      <NavLink href="/login" style={{ marginRight: '.9rem' }}>
        Login
      </NavLink>
      <NavLink href="/signup">
        <PostGigButton>Signup</PostGigButton>
      </NavLink>
    </NavLinks>
  </StyledNav>
);

export default NavLoginSignup;
