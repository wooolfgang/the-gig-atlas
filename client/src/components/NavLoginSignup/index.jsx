import React from 'react';
import { StyledNav, NavLinks, PostGigButton } from './style';
import NavLink from '../NavLink';

const NavLoginSignup = () => (
  <StyledNav>
    <NavLink href="/">The Gig Atlas</NavLink>
    <NavLinks>
      <NavLink href="/login">Login</NavLink>
      <NavLink href="/signup">
        <PostGigButton>Signup</PostGigButton>
      </NavLink>
    </NavLinks>
  </StyledNav>
);

export default NavLoginSignup;
