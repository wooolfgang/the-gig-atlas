import styled, { css, keyframes } from 'styled-components';

const DEFAULT_HEIGHT = 110;
const EXTENDED_HEIGHT = 160;

export const Card = styled.div`
  height: ${DEFAULT_HEIGHT}px;
  padding: 0.9rem 0.75rem 0rem 0.75rem;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  transition: all 125ms;
  overflow: hidden;
  outline: none;

  :focus,
  :focus-within,
  :hover {
    box-shadow: 0 0 0 1.5px hsla(0, 0%, 100%, 0.05),
      inset 0 0 0 1.25px rgba(82, 95, 127, 0.3),
      0 13px 27px -5px rgba(50, 50, 93, 0.25),
      0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
    height: ${EXTENDED_HEIGHT}px;
  }
`;

export const Flex = styled.div`
  display: flex;
  padding-bottom: 15px;
  box-sizing: border-box;
  height: calc(${DEFAULT_HEIGHT}px - 10px);
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
  font-size: 1.125em;
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

export const CenteredMobile = styled.div`
  display: flex;
  flex-direction: column;
  direction: rtl;
  height: 30px;
`;

export const GigExtension = styled.div`
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed lightgray;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  box-sizing: border-box;
  transition: all 125ms;
  flex-wrap: wrap;

  #gig-from {
    color: #525f7f;
    font-size: 0.8rem;
  }

  :hover {
    border: 1px dashed ${props => props.theme.color.d4};
  }
`;

export const A = styled.a`
  text-decoration: none;
  font-size: 0.85rem;
  color: ${props => props.theme.color.s2};

  ${GigExtension}:hover & {
    color: ${props => props.theme.color.s1};
  }

  :hover,
  :focus {
    color: ${props => props.theme.color.s1};
    text-decoration: underline;
  }
`;

export const GigCardSkeleton = styled.div`
  min-height: ${DEFAULT_HEIGHT}px;
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
  min-height: ${DEFAULT_HEIGHT}px;
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
