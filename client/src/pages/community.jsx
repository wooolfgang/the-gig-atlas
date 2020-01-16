import React from 'react';
import styled from 'styled-components';
import withAuthSync from '../components/withAuthSync';
import Nav from '../components/Nav';
import Community from '../components/Community';
import router from '../utils/router';

const Container = styled.div``;

const CommunityPage = () => (
  <div>
    <Nav type="NOT_AUTHENTICATED" />
    <Container>
      <Community />
    </Container>
  </div>
);

CommunityPage.getInitialProps = async ctx => {
  if (ctx.user) {
    router.toIndex(ctx);
  }
};

export default withAuthSync(CommunityPage, 'all');
