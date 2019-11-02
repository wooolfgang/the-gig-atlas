import React from 'react';
import { StyledNav, NavLinks, PostGigButton, LogoContainer } from './style';
import { MediaConsumer } from '../MediaProvider';
import { NavLink, Logo } from '../../primitives';

const Nav = ({ user }) => (
  <MediaConsumer>
    {({ size }) => (
      <StyledNav>
        <NavLink href="/">
          <LogoContainer>
            <Logo />
          </LogoContainer>
        </NavLink>
        {size === 'desktop' || size === 'giant' || !size ? (
          <NavLinks>
            <NavLink style={{ marginRight: '20px' }} href="/community">
              Community
            </NavLink>
            <NavLink style={{ marginRight: '20px' }} href="/gigs">
              Gigs
            </NavLink>
            {!user && (
              <NavLink style={{ marginRight: '20px' }} href="/login">
                Login
              </NavLink>
            )}
            <NavLink href="/gig/tech/create">
              <PostGigButton>Post A Gig</PostGigButton>
            </NavLink>
          </NavLinks>
        ) : (
          <div>Menu</div>
        )}
      </StyledNav>
    )}
  </MediaConsumer>
);

export default Nav;
