import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledA = styled.a`
  transition: 100ms;
  box-sizing: border-box;
  border-bottom: 2px solid transparent;
  transition: 200ms;
  transition: opacity 0.15s;
  opacity: 1;

  :hover {
    opacity: 0.8;
  }
`;

const NavLink = props => {
  const {
    href,
    as,
    replace,
    scroll,
    shallow,
    passHref,
    prefetch,
    children,
    style,
  } = props;

  return (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
    >
      <StyledA href={href} style={style}>
        {children}
      </StyledA>
    </Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  as: PropTypes.string,
  replace: PropTypes.bool,
  scroll: PropTypes.bool,
  shallow: PropTypes.bool,
  passHref: PropTypes.bool,
  prefetch: PropTypes.bool,
  style: PropTypes.shape({}),
};

NavLink.defaultProps = {
  children: null,
  as: null,
  replace: false,
  scroll: false,
  shallow: false,
  passHref: false,
  prefetch: false,
  style: {},
};

export default NavLink;
