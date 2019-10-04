import React from 'react';
// import { useMutation } from '@apollo/react-hooks';
import FormSignin from '../../components/FormSignin';
import withNoAuth from '../../components/WithNoAuthSync';

const Signin = () => (
  <>
    <FormSignin />
  </>
);

export default withNoAuth(Signin);
