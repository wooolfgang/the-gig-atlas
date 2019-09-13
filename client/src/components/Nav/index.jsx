import React from 'react';
import PropTypes from 'prop-types';
import { StyledNav, NavLinks, PostGigButton } from './style';
import NavLink from '../NavLink';

const Nav = ({ size }) => {
  return (
    <StyledNav>
      <NavLink href="/">The Gig Atlas</NavLink>
      {size === 'desktop' || size === 'giant' || !size ? (
        <NavLinks>
          <NavLink href="/freelancers">Freelancers</NavLink>
          <NavLink href="/gigs">Find Gigs</NavLink>
          <NavLink href="/gig/create">
            <PostGigButton>Post A Gig</PostGigButton>
          </NavLink>
        </NavLinks>
      ) : (
        <div>Menu</div>
      )}
    </StyledNav>
  );
};

Nav.propTypes = {
  size: PropTypes.string,
};

Nav.defaultProps = {
  size: 'giant',
};

export default Nav;
