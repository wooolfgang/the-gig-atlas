import styled from 'styled-components';

export const PortfolioContainer = styled.div`
  padding: 0.5rem 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
`;

export const PortfolioCard = styled.div`
  border: 1px solid ${props => props.theme.color.d4};
  height: 100px;
  width: 275px;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: inset 4px 20px 20px #fafafa;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  cursor: pointer;
  transition: 100ms ease-in-out;
  position: relative;

  :hover {
    background: ${props => props.theme.color.d5};
  }

  #project-title {
    display: block;
    margin-bottom: 0.2rem;
    font-weight: 500;
    font-size: 0.95rem;
  }

  #project-description {
    display: block;
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`;
