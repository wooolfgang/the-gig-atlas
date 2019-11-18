import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { useLazyQuery } from '@apollo/react-hooks';
import { AvatarUserContainer } from './style';
import { Avatar, Spinner, Button } from '../../primitives';
import Dropdown from '../Dropdown';
import { GET_USER } from '../../graphql/user';

const AvatarUserDropdown = ({ src, userId, avatarStyle, dropdownStyle }) => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = createRef(null);
  const [getUser, { loading, data }] = useLazyQuery(GET_USER, {
    variables: {
      where: {
        id: userId,
      },
    },
  });

  const handleMouseEnter = () => {
    setVisible(true);
    getUser();
  };

  const handleMouseLeave = () => {
    if (dropdownRef) {
      const x = window.event.clientX;
      const y = window.event.clientY;
      const elementMouseIsOver = document.elementFromPoint(x, y);
      if (dropdownRef.current === elementMouseIsOver) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  };

  const user = data && data.getUser;

  return (
    <AvatarUserContainer>
      <Dropdown
        visible={visible}
        style={{
          width: '150px',
          ...dropdownStyle,
          padding: '1rem .75rem',
        }}
        ref={dropdownRef}
        handleMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <>
            Loading...
            <Spinner />
          </>
        ) : (
          user && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '1rem',
              }}
            >
              <Avatar src={src} style={{ width: '48px', height: '48px' }} />
              <span style={{ marginBottom: '2px' }}>
                {' '}
                {user.firstName} {user.lastName}
              </span>
              <span style={{ marginBottom: '2px' }}>{user.website}</span>
              <span style={{ marginBottom: '2px' }}>{user.location}</span>
              <Button onClick={() => Router.push(`/user/${user.id}`)}>
                Visit Profile
              </Button>
            </div>
          )
        )}
      </Dropdown>
      <Avatar
        src={src}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ ...avatarStyle }}
      />
    </AvatarUserContainer>
  );
};

AvatarUserDropdown.propTypes = {
  src: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  avatarStyle: PropTypes.shape({}),
  dropdownStyle: PropTypes.shape({}),
};

AvatarUserDropdown.defaultProps = {
  avatarStyle: {},
  dropdownStyle: {},
};

export default AvatarUserDropdown;
