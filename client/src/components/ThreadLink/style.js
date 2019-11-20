import styled, { keyframes, css } from 'styled-components';

const loading = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

export const ThreadLinkContainer = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  padding: 0.2rem 0;
  box-sizing: border-box;

  &:hover,
  &:focus {
    outline: none;
  }

  #thread-link {
    outline: none;

    * {
      outline: none;
      transition: all 100ms ease-out;
    }

    &:hover,
    &:focus {
      cursor: pointer;

      #thread-title,
      #thread-lower {
        background: ${props => props.theme.color.neutral5};
        color: ${props => props.theme.color.d1};
      }
      #arrow-right-animated {
        svg {
          transform: translateX(3px);
        }
      }
    }
  }

  #thread-title {
    margin: 0;
    font-size: 1.1rem;
    text-decoration: none;
    color: ${props => props.theme.color.d1};
    margin-bottom: 4px;
    font-weight: 500;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 2px;
  }

  #thread-lower {
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 2px;
    color: ${props => props.theme.color.d3};
    display: flex;
    align-items: center;

    * {
      margin-right: 0.6rem;
      font-size: 0.85rem;
    }
  }
`;

export const UpvoteContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;
  box-sizing: border-box;

  #upvote-count {
    margin-top: 5px;
    font-size: 0.8rem;
  }
`;

export const ArrowRightContainer = styled.div``;

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

export const ThreadLinkContainerSkeleton = styled.div`
  display: flex;
  margin-bottom: 1.25rem;
  padding: 0.2rem 0.2rem;
  box-sizing: border-box;

  #upvote-count {
    border-radius: 50%;
    background: ${props => props.theme.color.neutral5};
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    overflow: hidden;
    ${after}
  }

  #thread-title {
    height: 1.15rem;
    background: ${props => props.theme.color.neutral5};
    width: 475px;
    max-width: 85vw;
    margin-bottom: 8px;
    position: relative;
    overflow: hidden;
    ${after}
  }

  #thread-lower div {
    display: inline-block;
    height: 1rem;
    background: ${props => props.theme.color.neutral5};
    width: 75px;
    margin-right: 1rem;
    position: relative;
    overflow: hidden;
    ${after}
  }
`;
