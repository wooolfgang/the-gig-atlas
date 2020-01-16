import styled from 'styled-components';
import media from '../../utils/media';

export const Container = styled.div`
  box-sizing: border-box;
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  padding-top: 2rem;
  display: grid;
  min-height: calc(100vh - 67.5px);
  grid-template-areas:
    '. . . .'
    '. main side .'
    '. . . .';
  grid-template-rows: 1rem 1fr 1rem;
  grid-template-columns: 1fr 65vw 21vw 1fr;

  ${media.tablet`
    grid-template-areas:
      '. . .'
      '. main .'
      '. side .';
    grid-template-rows: 1rem 1fr 1rem;
    grid-template-columns: 1fr 100vw 1fr;
  `}
`;

export const TagsContainer = styled.div`
  display: flex;
  max-width: 100vw;
  overflow: auto;
  box-sizing: border-box;
`;

export const ThreadContainer = styled.div`
  margin-top: 1.8rem;
`;

export const Main = styled.main`
  grid-area: main;
  padding-right: 2rem;
  box-sizing: border-box;
`;

export const Side = styled.div`
  grid-area: side;
`;

export const CollabContainer = styled.div`
  background: ${props => props.theme.color.d5};
  box-shadow: inset
  height: 376px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: center;

  #top-header {
    padding: 1rem .75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    background-color: ${props => props.theme.color.d5};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='blue' fill-opacity='0.075' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
    transition: all 100ms ease-in-out;

    :hover {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='blue' fill-opacity='0.30' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
    }

    span {
      padding: 0px 2px;
      display: block;
      margin-bottom: 3px;
      color: ${props => props.theme.color.d2};
      border-radius: 2px;
    }    
  }

  #newest-freelancers {
    padding-top: 1rem;
    padding-left: 1.8rem;
    box-shadow: inset 0 0 20px white;
    box-sizing: border-box;
    background: ${props => props.theme.color.d6};
    width: 100%;
    height: 100%;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PaginationLink = styled.a`
  text-decoration: none;
  font-size: 0.8rem;
  margin-left: 4px;
  color: ${props => props.theme.color.d3};

  :hover,
  :focus {
    color: ${props => props.theme.color.d2};
  }
`;

export const ThreadCreateLink = styled.a`
  text-decoration: none;
  padding: 1rem 1rem;
  border: 1px dashed ${props => props.theme.color.neutral20};
  display: inline-block;
  transition: 100ms;
  outline: none;

  :hover,
  :focus {
    border: 1px dashed ${props => props.theme.color.neutral40};
  }
`;
