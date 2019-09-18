import React from 'react';
import { StyledNav, NavLinks, PostGigButton } from './style';
import { MediaConsumer } from '../MediaProvider';
import NavLink from '../NavLink';

const Nav = () => {
  return (
    <MediaConsumer>
      {({ size }) => (
        <StyledNav>
          <NavLink href="/">The Gig Atlas</NavLink>
          {size === 'desktop' || size === 'giant' || !size ? (
            <NavLinks>
              <NavLink href="/freelancers">Freelancers</NavLink>
              <NavLink href="/gigs">Find Gigs</NavLink>
              <NavLink href="/gig/software/create">
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
};

export default Nav;
