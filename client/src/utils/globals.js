import PropTypes from 'prop-types';

export const zIndex = {
  dropdown: 99,
};

export const propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isEmailVerified: PropTypes.bool,
    avatar: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};
