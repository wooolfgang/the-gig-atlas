import React, { useEffect, useRef } from 'react';
import { node, bool, func, string, shape } from 'prop-types';
import { ModalOuter, ModalInner } from './style';

const Modal = ({
  children,
  visible,
  width,
  height,
  padding,
  closeModal,
  innerModalStyle,
  outerModalStyle,
}) => {
  const innerModal = useRef();
  const outerModal = useRef();

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        visible &&
        outerModal.current &&
        outerModal.current.contains(e.target) &&
        !innerModal.current.contains(e.target)
      ) {
        closeModal();
      }
    }
    document.addEventListener('click', handleOutsideClick, false);

    return () =>
      document.removeEventListener('click', handleOutsideClick, false);
  }, [closeModal, visible]);

  return (
    <>
      {visible && (
        <ModalOuter ref={outerModal} style={outerModalStyle}>
          <ModalInner
            ref={innerModal}
            width={width}
            height={height}
            padding={padding}
            style={innerModalStyle}
          >
            {children}
          </ModalInner>
        </ModalOuter>
      )}
    </>
  );
};

Modal.propTypes = {
  children: node.isRequired,
  visible: bool.isRequired,
  closeModal: func,
  width: string,
  height: string,
  padding: string,
  innerModalStyle: shape({}),
  outerModalStyle: shape({}),
};

Modal.defaultProps = {
  closeModal: undefined,
  width: '300px',
  height: 'auto',
  padding: '5px',
  innerModalStyle: {},
  outerModalStyle: {},
};

export default Modal;
