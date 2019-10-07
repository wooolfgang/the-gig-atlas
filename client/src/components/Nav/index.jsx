import React from 'react';
import { StyledNav, NavLinks, PostGigButton } from './style';
import { MediaConsumer } from '../MediaProvider';
import NavLink from '../../primitives/NavLink';

const Nav = () => (
  <MediaConsumer>
    {({ size }) => (
      <StyledNav>
        <NavLink href="/">The Gig Atlas</NavLink>
        {size === 'desktop' || size === 'giant' || !size ? (
          <NavLinks>
            <NavLink style={{ marginRight: '20px' }} href="/community">
              Community
            </NavLink>
            <NavLink style={{ marginRight: '20px' }} href="/gigs">
              Gigs
            </NavLink>
            <NavLink style={{ marginRight: '20px' }} href="/auth/signin">
              Login
            </NavLink>
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
