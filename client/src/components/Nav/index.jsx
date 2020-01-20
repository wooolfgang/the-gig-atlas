import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import {
  StyledNav,
  NavLinks,
  PostGigButton,
  LogoContainer,
  Search,
  SearchContainer,
  Badge,
} from './style';
import { MediaConsumer } from '../MediaProvider';
import { NavLink, Logo, Button, Avatar } from '../../primitives';
import auth from '../../utils/auth';
import router from '../../utils/router';
import SearchIcon from '../../icons/Search';
import { color } from '../../utils/theme';
import { propTypes } from '../../utils/globals';
import Dropdown from '../Dropdown';
import Menu from '../../icons/Menu';
import Cancel from '../../icons/Cancel';

const NotAuthenticated = () => (
  <NavLinks>
    <NavLink style={{ marginRight: '20px', position: 'relative' }} href="/gigs">
      Find Gigs
      <Badge>NEW</Badge>
    </NavLink>
    <NavLink style={{ marginRight: '20px' }} href="/community">
      Community
    </NavLink>
    <NavLink style={{ marginRight: '20px', display: 'flex' }} href="/login">
      Login
    </NavLink>
    <NavLink href="/gig/tech/create">
      <PostGigButton>Post A Gig</PostGigButton>
    </NavLink>
  </NavLinks>
);

const LoginSignup = () => (
  <NavLinks>
    <NavLink
      href="/login"
      style={{ marginRight: '.9rem', textAlign: 'center' }}
    >
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
);

const AuthenticatedFreelancer = withRouter(({ router: { route }, user }) => (
  <>
    <SearchContainer
      onClick={() => {
        Router.push({
          pathname: '/gigs',
          query: {
            from: 'main',
            focused: true,
          },
        });
      }}
    >
      <Search type="search" placeholder="Find remote gigs and jobs" />
      <SearchIcon
        width="18"
        height="18"
        viewBox="0 0 22 22"
        fill={color.neutral40}
        style={{
          position: 'absolute',
          top: '6px',
          right: '10px',
        }}
      />
    </SearchContainer>
    <NavLinks>
      <Button
        styleType={route === '/thread/create' ? 'default' : 'primary'}
        style={{ padding: '.5rem .5rem', fontSize: '.9rem' }}
        onClick={() => Router.push('/thread/create')}
      >
        Create Thread
      </Button>
      <div>
        <Avatar
          style={{ width: '38px', height: '38px', marginLeft: '1.5rem' }}
          src={user && user.avatar && user.avatar.url}
          onClick={() => {
            auth.logout();
            router.toIndex();
          }}
        />
      </div>
    </NavLinks>
  </>
));

const MobileMenu = ({ content }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      {visible ? (
        <Cancel
          onClick={toggleVisibility}
          fill={color.neutral70}
          width="32"
          height="32"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <Menu
          onClick={toggleVisibility}
          fill={color.neutral70}
          width="32"
          height="32"
          style={{ cursor: 'pointer' }}
        />
      )}
      <Dropdown visible={visible} style={{ width: '100vw' }}>
        {content}
      </Dropdown>
    </div>
  );
};

MobileMenu.propTypes = {
  content: PropTypes.node.isRequired,
};

const NavType = {
  NOT_AUTHENTICATED: NotAuthenticated,
  AUTHENTICATED_FREELANCER: AuthenticatedFreelancer,
  LOGO_ONLY: () => <div />,
  LOGIN_SIGNUP: LoginSignup,
};

const Nav = ({ type, user }) => {
  const NavContent = NavType[type];

  if (!NavContent) {
    throw new Error(
      `Nav type does not exist. Please select from the following ${Object.keys(
        NavType,
      )}`,
    );
  }

  return (
    <MediaConsumer>
      {({ size }) => (
        <StyledNav>
          <NavLink href="/">
            <LogoContainer>
              <Logo />
            </LogoContainer>
          </NavLink>
          {size === 'desktop' || size === 'giant' || !size ? (
            <NavContent user={user} />
          ) : (
            <MobileMenu content={<NavContent />} />
          )}
        </StyledNav>
      )}
    </MediaConsumer>
  );
};

Nav.propTypes = {
  type: PropTypes.string.isRequired,
  user: propTypes.user,
};

Nav.defaultProps = {
  user: null,
};

export default Nav;
