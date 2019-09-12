import React from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Nav from '../components/Nav';
import useInterval from '../utils/useInterval';

const HeaderContainer = styled.header`
  width: 675px;
  max-width: 100vw;
  margin: auto;
  margin-top: 50px;
  position: relative;
  text-align: center;
`;

const H1 = styled.h1`
  font-weight: 600;
  font-size: 2.15rem;
  line-height: 46px;
`;

const P = styled(animated.p)`
  font-size: 1.2rem;
  line-height: 27px;
  text-align: center;
  color: ${props => props.theme.color.d2};
`;

const pages = [
  props => (
    <AnimatedText
      {...props}
      text="We bridge the gap between client and freelancers No vendor lock-in, choose your own payment system and forms of communication."
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

const TransitionTexts = () => {
  const [index, set] = React.useState(0);

  useInterval(() => {
    set(index === pages.length - 1 ? 0 : index + 1);
  }, 5000);

  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, top: '35px' },
    enter: { opacity: 1, top: '45px' },
    leave: { opacity: 0, top: '55px' },
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
        }}
      />
    );
  });
};

const Header = () => {
  return (
    <HeaderContainer>
      <H1>Find gigs that let’s you move forward.</H1>
      <TransitionTexts />
    </HeaderContainer>
  );
};

const Index = () => (
  <div>
    <Nav />
    <Header />
  </div>
);

export default Index;
