import React from 'react';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import Nav from '../../../components/Nav';
import Stepper from '../../../components/Stepper';
import EnterGigDetails from '../../../components/EnterGigDetails';

const Container = styled.div`
  background: ${props => props.theme.color.d5};
  min-height: 75vh;
  padding: 2.75rem 0;
`;

const StepperContainer = styled.div`
  width: 900px;
  max-width: 100vw;
  margin: auto;
`;

const FormContainer = styled.div`
  width: 900px;
  max-width: 100vw;
  margin: auto;
  margin-top: 1.5em;
  padding: 2em;
  box-sizing: border-box;
  background: ${props => props.theme.color.d7};
`;

const Post = () => {
  const router = useRouter();
  const { section } = router.query;
  const steps = [
    {
      title: 'Enter gig details',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
      key: 'create',
    },
    {
      title: 'Enter your info',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
      key: 'enter-info',
    },
    {
      title: 'Preview your post',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
      key: 'preview-post',
    },
    {
      title: 'Purchase',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
      key: 'purchase',
    },
  ];

  const activeIndex = steps.findIndex(s => s.key === section);

  const next = () => {
    if (activeIndex < steps.length - 1) {
      const { key } = steps[activeIndex + 1];
      const href = router.pathname.replace('[section]', key);
      Router.push(href, href, { shallow: true });
    }
  };

  const back = () => {
    if (activeIndex >= 1) {
      const { key } = steps[activeIndex - 1];
      const href = router.pathname.replace('[section]', key);
      Router.push(href, href, { shallow: true });
    }
  };

  return (
    <div>
      <Nav />
      <div style={{ padding: '0 8.3%' }}>
        <h1>Create a software gig</h1>
      </div>
      <Container>
        <StepperContainer>
          <Stepper steps={steps} activeIndex={activeIndex} />
        </StepperContainer>
        <FormContainer>
          {activeIndex === 0 && <EnterGigDetails back={back} next={next} />}
          {activeIndex === 1 && <EnterGigDetails back={back} next={next} />}
          {activeIndex === 2 && <EnterGigDetails back={back} next={next} />}
          {activeIndex === 3 && <EnterGigDetails back={back} next={next} />}
        </FormContainer>
      </Container>
    </div>
  );
};

export default Post;
