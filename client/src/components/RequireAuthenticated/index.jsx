import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Modal from '../Modal';
import {
  WrapperButton,
  SwitchButton,
  DisablePointerEvents,
  ModalContainer,
} from './style';
import FormSignin from '../FormSignin';
import FormSignup from '../FormSignup';
import AuthProvider from '../AuthProvider';
import { OAUTH_URL } from '../../graphql/auth';
import Spinner from '../../primitives/Spinner';

const AuthType = {
  LOG_IN: 'LOG_IN',
  SIGN_UP: 'SIGN_UP',
};

const ModalAuthenticate = ({ isModalOpen, closeModal }) => {
  const { data, loading } = useQuery(OAUTH_URL);
  const [switchValue, setSwitchValue] = useState(AuthType.LOG_IN);
  const handleSwitchChange = () => {
    setSwitchValue(prevVal =>
      prevVal === AuthType.LOG_IN ? AuthType.SIGN_UP : AuthType.LOG_IN,
    );
  };

  return (
    <Modal visible={isModalOpen} closeModal={closeModal} width="450px">
      <ModalContainer>
        {switchValue === AuthType.LOG_IN ? (
          <>
            <SwitchButton onClick={handleSwitchChange}>
              Don't have an account yet? Click here to sign up.
            </SwitchButton>
          </>
        ) : (
          <SwitchButton onClick={handleSwitchChange}>
            Already have an account? Click here to log In.
          </SwitchButton>
        )}
        <div style={{ marginBottom: '1.5rem' }} />
        {loading ? (
          <Spinner />
        ) : (
          <>
            <AuthProvider oauthURL={data.oauthURL} />
            <div
              style={{ padding: '20px 0', fontSize: '.9rem', opacity: 0.75 }}
            >
              or continue with email...
            </div>
            {switchValue === 'LOG_IN' ? <FormSignin /> : <FormSignup />}
          </>
        )}
      </ModalContainer>
    </Modal>
  );
};

ModalAuthenticate.propTypes = {
  isModalOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
};

ModalAuthenticate.defaultProps = {
  isModalOpen: false,
};

const RequireAuthenticated = ({ isAuthenticated, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isAuthenticated) {
    return children;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <ModalAuthenticate isModalOpen={isModalOpen} closeModal={closeModal} />
      <WrapperButton onClick={openModal}>
        <DisablePointerEvents>{children}</DisablePointerEvents>
      </WrapperButton>
    </div>
  );
};

RequireAuthenticated.propTypes = {
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

RequireAuthenticated.defaultProps = {
  isAuthenticated: false,
};

export default RequireAuthenticated;
