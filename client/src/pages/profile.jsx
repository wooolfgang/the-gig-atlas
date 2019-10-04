import React from 'react';
import WithAuthSync from '../components/withAuthSync';

const Profile = () => (
  <div>
    <h1>Temporary Profile page</h1>
  </div>
);

export default WithAuthSync(Profile);
