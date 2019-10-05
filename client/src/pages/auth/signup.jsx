import React from 'react';
import FormSignup from '../../components/FormSignup';
import withNoAuth from '../../components/withNoAuthSync';

const Signup = () => (
  <>
    <FormSignup />
  </>
);

// => set no auth for this page
export default withNoAuth(Signup);
