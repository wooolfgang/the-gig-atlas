import styled from 'styled-components';
import media from '../../utils/media';

export const Container = styled.div`
  border-radius: 2px;
  width: 800px;
  max-width: 100vw;
  padding: 1.5rem 1.75rem;
  box-sizing: border-box;

  ${media.phone`
    padding: .5rem .75rem;
  `};
`;

export const Skill = styled.div`
  background-color: ${props => props.theme.color.p2};
  padding: 0.2rem 0.4rem;
  font-size: 0.825em;
  box-sizing: border-box;
  margin-right: 0.4rem;
`;

export const PortfolioContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 2rem 0rem;
  box-sizing: border-box;
`;

export const ProjectCard = styled.div`
  flex: 1;
  min-width: 300px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  display: flex;
  cursor: pointer;
  flex-direction: column;

  #project-label {
    color: ${props => props.theme.color.d3};
    margin-top: 0.5rem;
    display: block;
  }

  * {
    transition: all 200ms ease-in-out;
  }

  :hover {
    #project-image {
      transform: translateY(-2px);
      box-shadow: 1px 1px 1px 2px ${props => props.theme.color.neutral10};
    }

    #project-label {
      color: ${props => props.theme.color.d1};
    }
  }
`;

export const ProjectImage = styled.div`
  height: 200px;
  border: 1px solid white;
  box-shadow: 1px 1px 1px 2px ${props => props.theme.color.neutral5};
  background: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;
