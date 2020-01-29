import styled from 'styled-components';

export const Filter = styled.div``;

export const FilterContainer = styled.div`
  grid-area: filter;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  .filter-name {
    margin: 0.75rem 0;
    color: ${props => props.theme.color.neutral80};
  }

  .filter-label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.color.neutral70};
  }
`;
