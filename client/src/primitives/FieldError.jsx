import React from 'react';
import { animated, useTransition } from 'react-spring';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Error = styled(animated.span)`
  display: block;
  font-size: 0.8rem;
  opacity: 1;
  margin-top: 0.5rem;
  color: ${props => props.theme.color.e1};
`;

const FieldError = ({ value, visible }) => {
  const transitions = useTransition(visible, null, {
    from: { transform: 'translateX(0rem)' },
    enter: () => async next => {
      await next({ transform: 'translateX(-0.3px)' });
      await next({ transform: 'translateX(0.4px)' });
      await next({ transform: 'translateX(0px)' });
    },
    leave: { transform: 'translateX(0rem)' },
    config: {
      mass: 1,
      tension: 500,
      friction: 26,
      duration: 100,
    },
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <Error key={key} style={props}>
          {value}
        </Error>
      ),
  );
};

FieldError.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
};

FieldError.defaultProps = {
  value: '',
  visible: true,
};

export default FieldError;
