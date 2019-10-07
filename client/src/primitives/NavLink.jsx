import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

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
      <a href={href} style={style}>
        {children}
      </a>
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
