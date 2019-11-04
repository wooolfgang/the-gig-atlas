import React from 'react';
import withAuthSync from '../components/withAuthSync';

const Profile = ({ user }) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    {' '}
    <h1 style={{ margin: 'auto' }}>😀 🙄 😥 </h1>
  </div>
);

export default withAuthSync(Profile, 'MEMBER');
