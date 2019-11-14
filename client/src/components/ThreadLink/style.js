import styled from 'styled-components';

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
