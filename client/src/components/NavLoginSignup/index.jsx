import React from 'react';
import { StyledNav, NavLinks, LogoContainer } from '../Nav/style';
import { NavLink, Logo, Button } from '../../primitives';

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
        <Button
          style={{
            padding: '0.4rem 0.8rem',
          }}
        >
          Signup
        </Button>
      </NavLink>
    </NavLinks>
  </StyledNav>
);

export default NavLoginSignup;
