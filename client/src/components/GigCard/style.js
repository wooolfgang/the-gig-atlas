import styled, { css, keyframes } from 'styled-components';

export const Card = styled.div`
  min-height: 111px;
  padding: 0.75rem;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  transition: all 150ms ease-in-out;
  overflow: hidden;

  :focus,
  :hover {
    transform: translateY(-2px);
    box-shadow: 2px 0px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const Flex = styled.div`
  display: flex;
`;

export const Avatar = styled.div`
  border-radius: 50%;
  width: 4em;
  height: 4em;

  ${props =>
    props.src &&
    `
      border: 1px solid ${props.theme.color.d5};
      background: url(${props.src}) center center no-repeat;
      -webkit-background-size: contain;
      -moz-background-size: contain;
      -o-background-size: contain;
      background-size: contain;
      box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
      `}
`;

export const Title = styled.h4`
  margin: 0px;
  margin-bottom: 0.3em;
  font-size: 1.15em;
`;

export const Tech = styled.small`
  background-color: ${props => props.theme.color.p2};
  margin-left: 4px;
  padding: 3px 5px;
  font-size: 0.825em;
  box-sizing: border-box;
`;

export const Row = styled.div`
  width: ${props => props.width};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FirstRow = styled(Row)`
  padding: 0.5rem;
`;

export const SecondRow = styled(Row)``;

export const ThirdRow = styled(Row)`
  direction: rtl;
`;

export const Centered = styled.div`
  display: flex;
  flex-direction: column;
  direction: rtl;
`;

export const GigCardSkeleton = styled.div`
  min-height: 111px;
  padding: 0.75rem;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  transition: all 150ms ease-in-out;
  overflow: hidden;
`;

const loading = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const after = css`
  &::after {
    content: '';
    transform: translateX(-100%);
    animation: ${loading} 1.5s infinite;
    background: ${props => `
      linear-gradient(
        90deg,
        transparent,
        ${props.theme.color.neutral0},
        transparent
      )
      `};
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
  }
`;

export const GigSkeletonContainer = styled.div`
  min-height: 111px;
  padding: 0.75rem;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  transition: all 150ms ease-in-out;
  overflow: hidden;
  margin-bottom: 12px;

  #gig-avatar {
    border-radius: 50%;
    background: ${props => props.theme.color.neutral5};
    width: 4rem;
    height: 4rem;
    position: relative;
    overflow: hidden;
    ${after}
  }

  #gig-title {
    height: 1.45rem;
    background: ${props => props.theme.color.neutral5};
    width: 475px;
    max-width: 85vw;
    margin-bottom: 8px;
    position: relative;
    overflow: hidden;
    ${after}
  }

  #gig-description {
    height: 1.15rem;
    background: ${props => props.theme.color.neutral5};
    width: 425px;
    max-width: 85vw;
    margin-bottom: 8px;
    position: relative;
    overflow: hidden;
    ${after}
  }
`;
