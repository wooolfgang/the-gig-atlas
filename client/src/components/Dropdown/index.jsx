import React from 'react';
import PropTypes from 'prop-types';
import { DropdownContainer, DropdownCard } from './style';
import noop from '../../utils/noop';

const Dropdown = (
  { children, style, visible, handleMouseLeave, handleMouseEnter },
  ref,
) => (
  <DropdownContainer visible={visible}>
    <DropdownCard
      visible={visible}
      ref={ref}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={style}
    >
      {children}
    </DropdownCard>
  </DropdownContainer>
);

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape({}),
  visible: PropTypes.bool,
  handleMouseLeave: PropTypes.func,
  handleMouseEnter: PropTypes.func,
};

Dropdown.defaultProps = {
  style: {
    width: '400px',
    height: 'auto',
  },
  visible: false,
  handleMouseLeave: noop,
  handleMouseEnter: noop,
};

export default React.forwardRef(Dropdown);
