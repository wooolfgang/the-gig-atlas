import React from 'react';
import { animated, useTransition } from 'react-spring';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Help = styled(animated.span)`
  display: block;
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const FieldHelp = ({ value, visible }) => {
  const transitions = useTransition(visible, null, {
    from: { opacity: 0, transform: 'translateY(0rem)' },
    enter: { opacity: 0.75, transform: 'translateY(-0.2rem)' },
    leave: { opacity: 0, transform: 'translateY(.2rem)' },
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <Help key={key} style={props}>
          {value}
        </Help>
      ),
  );
};

FieldHelp.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
};

FieldHelp.defaultProps = {
  value: '',
  visible: true,
};

export default FieldHelp;
