import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../../components/Nav';
import GigsList from '../../components/GigsList';
import HTMLHead from '../../components/HTMLHead';
import { GET_GIGS_LIST_FOR_LANDING } from '../../graphql/gig';
import BannerSvg from './svg/banner';
import GigsSvg from './svg/gigs';
import Spinner from '../../primitives/Spinner';
import media from '../../utils/media';

const BannerContainer = styled.div`
  width: 100vw;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-image: radial-gradient(#d7d7d7 1px, transparent 1px),
    radial-gradient(#d7d7d7 1px, transparent 1px);
  background-position: 0 0, 25px 25px;
  background-size: 50px 50px;
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const BannerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 950px;
  max-width: 100vw;
  overflow: hidden;
  padding-left: 2rem;

  ${media.tablet`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  `}
`;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 2.6rem;
  margin-bottom: 1.4rem;
  margin-top: 0;
  color: ${props => props.theme.color.s1};
`;

const SubText = styled.p`
  font-size: 1.1rem;
  line-height: 1.5rem;
  color: ${props => props.theme.color.d2};
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  -webkit-align-self: flex-start;
  -ms-flex-item-align: start;
  align-self: flex-start;
  border-style: solid;
  border-width: 0px 0px 1px;
  border-radius: 4px;
  border-color: ${props => props.theme.color.s2};
  background-color: ${props => props.theme.color.s2};
  box-shadow: 1px 1px 4px 0 rgba(64, 119, 249, 0.2);
  -webkit-transition: opacity 200ms ease, color 200ms ease,
    border-color 200ms ease, background-color 200ms ease;
  transition: opacity 200ms ease, color 200ms ease, border-color 200ms ease,
    background-color 200ms ease;
  color: #fff;
  font-weight: 400;
  text-align: center;
  text-shadow: 1px 1px 2px #6c99db;
  cursor: pointer;

  :hover {
    background-color: #144ffc;
  }
`;

const GigsContainer = styled.div`
  width: 100vw;
  padding: 0rem 0.25rem 2rem 0.25rem;
  min-height: 70vh;
  height: auto;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.color.d5};
`;

const GigsGrid = styled.div`
  width: 950px;
  max-width: 100vw;
  display: flex;
  padding: 0.75rem 1.5rem 2.5rem 1.5rem;
  box-sizing: border-box;
  flex-direction: column;

  h2 {
    margin: 2rem 0 1rem 0;
  }
`;

const Banner = () => (
  <BannerContainer>
    <BannerInner>
      <div>
        <H1>Find gigs that let’s you move forward.</H1>
        <SubText>
          We bridge the gap between client and freelancers. Join our community
          of freelancers and remote workers.
        </SubText>
        <Button> Get Started </Button>
      </div>
      <BannerSvg />
    </BannerInner>
  </BannerContainer>
);

const Index = () => {
  const { data, loading } = useQuery(GET_GIGS_LIST_FOR_LANDING, {
    fetchPolicy: 'cache-and-network',
  });
  return (
    <>
      <HTMLHead />
      <Nav />
      <Banner />
      <GigsContainer>
        <GigsGrid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '1.4rem',
                fontWeight: 500,
              }}
            >
              Our Latest Gigs
            </p>
            <GigsSvg />
          </div>
          {loading ? (
            <span>
              Loading... <Spinner />{' '}
            </span>
          ) : (
            <GigsList gigs={data ? data.gigsListLanding : []} />
          )}
        </GigsGrid>
      </GigsContainer>
    </>
  );
};

export default Index;
