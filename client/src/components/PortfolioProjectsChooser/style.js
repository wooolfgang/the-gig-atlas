import styled from 'styled-components';
import { InputStyles } from '../../utils/theme';

export const Search = styled.input`
  ${InputStyles};
  width: 100% !important;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  box-sizing: border-box;
  margin: 0.2rem 0;
`;

export const ProjectsContainer = styled.div`
  padding: 0.3rem 0;
  box-sizing: border-box;
  overflow: auto;
  height: 75%;
`;

export const ProjectContainer = styled.div`
  margin-bottom: 4px;
  cursor: pointer;
  padding: 4px;
  box-sizing: border-box;

  ${props =>
    props.selected &&
    `
    background: ${props.theme.color.d5};
    text-decoration: line-through;
  `}

  :hover {
    background: ${props => props.theme.color.d5};
  }

  #project-description {
    color: ${props => props.theme.color.d3};
  }
`;

export const SubmitContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
`;
