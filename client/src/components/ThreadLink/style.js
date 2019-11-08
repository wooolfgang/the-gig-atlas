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
    &:hover,
    &:focus {
      cursor: pointer;

      #thread-title {
        background: ${props => props.theme.color.neutral5};
      }
      #thread-lower {
        background: ${props => props.theme.color.neutral5};
      }
    }
  }

  #thread-title {
    font-size: 1.1rem;
    text-decoration: none;
    color: ${props => props.theme.color.d1};
    margin-bottom: 4px;
    font-weight: 500;
    padding: 0 4px;
    box-sizing: border-box;
  }

  #thread-lower {
    display: inline-block;
    padding: 0 4px;
    box-sizing: border-box;

    * {
      margin-right: 1rem;
      font-size: 0.875rem;
    }
  }

  #upvote-count-container {
    margin-right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2px;
    box-sizing: border-box;
  }

  #upvote-count {
    font-size: 0.8rem;
  }
`;
