import React from 'react';
import { StyledNav, NavLinks, PostGigButton } from './style';
import NavLink from '../NavLink';

const Nav = () => (
  <StyledNav>
    <NavLink href="/">The Gig Atlas</NavLink>
    <NavLinks>
      <NavLink href="/freelancers">Freelancers</NavLink>
      <NavLink href="/gigs">Find Gigs</NavLink>
      <NavLink href="/gig/create">
        <PostGigButton>Post A Gig</PostGigButton>
      </NavLink>
    </NavLinks>
  </StyledNav>
);

export default Nav;
