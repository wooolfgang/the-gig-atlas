import React from 'react';
import { StyledNav, NavLinks, PostGigButton } from './style';
import NavLink from '../../primitives/NavLink';

const NavLoginSignup = () => (
  <StyledNav>
    <NavLink href="/">The Gig Atlas</NavLink>
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
