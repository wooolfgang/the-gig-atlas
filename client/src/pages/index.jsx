import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../components/Nav';
import { MediaConsumer } from '../components/MediaProvider';
import GigsList from '../components/GigsList';
import HTMLHead from '../components/HTMLHead';
import useInterval from '../utils/useInterval';
import media from '../utils/media';
import { GET_GIGS_LIST_FOR_LANDING } from '../graphql/gig';
import Spinner from '../primitives/Spinner';

const HeaderContainer = styled.header`
  width: 675px;
  max-width: 100vw;
  min-height: 25vh;
  margin: auto;
  position: relative;
  text-align: center;

  ${media.phone`
    min-height: 30vh;
  `};

  ${media.xsPhone`
    min-height: 35vh;
  `};
`;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 2.15rem;
  line-height: 2.875rem;
`;

const P = styled(animated.p)`
  font-size: 1.2rem;
  line-height: 1.6875rem;
  text-align: center;
  color: ${props => props.theme.color.d2};
`;

const GigsContainer = styled.div`
  background-color: ${props => props.theme.color.d5};
  width: 100%;
  min-height: 70vh;
  height: auto;
`;

const GigsGrid = styled.div`
  width: 750px;
  max-width: 100vw;
  display: flex;
  margin: auto;
  padding: 2.5rem 1.5rem;
  box-sizing: border-box;
  flex-direction: column;

  h2 {
    margin: 2rem 0 1rem 0;
  }
`;

const Search = styled.input`
  width: 100%;
  background: ${props => props.theme.color.d6};
  border: none;
  border: 1px solid ${props => props.theme.color.d2};
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 40px;
  padding: 4px 8px;
  box-sizing: border-box;
  font-size: 1rem;

  :hover,
  :focus {
    outline: none;
    border: none;
    border: 2px solid ${props => props.theme.color.s1};
  }
`;

const pages = [
  props => (
    <AnimatedText
      {...props}
      text="We bridge the gap between client and freelancers. No vendor lock-in, choose your own payment system and forms of communication."
    />
  ),
  props => (
    <AnimatedText
      {...props}
      text="We empower freelancers 0% fees and, inpendent, personalized profiles."
    />
  ),
];

const AnimatedText = ({ style, text }) => <P style={style}>{text}</P>;

AnimatedText.propTypes = {
  style: PropTypes.shape({
    position: PropTypes.string,
    width: PropTypes.string,
  }).isRequired,
  text: PropTypes.string.isRequired,
};

const TransitionTexts = ({ size }) => {
  const [index, set] = React.useState(0);

  let top = 35;

  if (size === 'tablet') {
    top = 70;
  } else if (size === 'phone') {
    top = 75;
  } else if (size === 'xsPhone') {
    top = 80;
  }

  useInterval(() => {
    set(index === pages.length - 1 ? 0 : index + 1);
  }, 5000);

  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, top: top + 0 },
    enter: { opacity: 1, top: top + 5 },
    leave: { opacity: 0, top: top + 10 },
  });

  return transitions.map(({ item, props, key }) => {
    const Page = pages[item];
    return (
      <Page
        key={key}
        style={{
          ...props,
          position: 'absolute',
          width: '100%',
          top,
        }}
      />
    );
  });
};

const Header = () => (
  <MediaConsumer>
    {({ size }) => (
      <HeaderContainer>
        <H1>Find gigs that let’s you move forward.</H1>
        <TransitionTexts size={size} />
      </HeaderContainer>
    )}
  </MediaConsumer>
);

const Index = () => {
  const { data, loading } = useQuery(GET_GIGS_LIST_FOR_LANDING);
  return (
    <>
      <HTMLHead />
      <Nav />
      <Header />
      <GigsContainer>
        <GigsGrid>
          <Search type="search" placeholder="Search for design, dev gigs" />
          <h2>Our Latest Gigs</h2>
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
