import styled from 'styled-components';
import media from '../../utils/media';

export const Container = styled.div`
  padding: 0.5rem 8.3%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 10rem;
  align-items: center;
  background: #fff;
  box-shadow: inset 0 0 15px #fafafa;
  flex-wrap: wrap;

  ${media.phone`
    flex-direction: column;
    justify-content: center;
    height: 12rem;
  `}
`;

export const Left = styled.div`
  display: flex;
  color: ${props => props.theme.color.neutral50};
  flex-direction: column;

  ${media.phone`
    align-items: center;
    text-align: center;
  `}

  a {
    text-decoration: none;
    color: ${props => props.theme.color.s2};
  }

  * {
    font-size: 0.925rem;
    margin-bottom: 0.5rem;
  }
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.color.neutral50};
  font-size: 0.95rem;
  align-items: flex-end;

  ${media.phone`
    align-items: center;
  `}

  * {
    font-size: 0.925rem;
    margin-bottom: 0.5rem;
  }
`;

export const Links = styled.div`
  * {
    margin-left: 0.5rem;
    font-size: 0.925rem;
  }

  a {
    text-decoration: none;
    transition: all 100ms;
    color: ${props => props.theme.color.neutral50};
  }

  a:hover {
    color: ${props => props.theme.color.neutral70};
  }
`;
