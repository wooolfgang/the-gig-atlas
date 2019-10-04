import React from 'react';
// import { useMutation } from '@apollo/react-hooks';
import FormSignin from '../../components/FormSignin';
import withNoAuth from '../../components/withNoAuthSync';

const Signin = () => (
  <>
    <FormSignin />
  </>
);

// => set no auth for this page
export default withNoAuth(Signin);
