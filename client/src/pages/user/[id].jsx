import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import FreelancerProfile from '../../components/FreelancerProfile';
import media from '../../utils/media';

const Container = styled.main`
  width: 100vw;
  display: flex;
  box-sizing: border-box;
  box-shadow: inset 4px 20px 20px #fafafa;
  justify-content: center;
  padding: 1rem 0;
  min-height: calc(100vh - 67.5px);

  ${media.phone`
    padding: .2rem 0;
  `}
`;

const UserProfile = () => {
  const router = useRouter();
  const userId = router.query.id;

  return (
    <>
      <Nav type="AUTHENTICATED_FREELANCER" />
      <Container>
        <FreelancerProfile userId={userId} />
      </Container>
    </>
  );
};

export default UserProfile;
