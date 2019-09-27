import styled from 'styled-components';

export const Card = styled.div`
  min-height: 111px;
  padding: 0.75rem;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  transition: all 150ms ease-in-out;

  :focus,
  :hover {
    transform: translateY(-2px);
    box-shadow: 2px 0px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const Flex = styled.div`
  display: flex;
`;

export const Avatar = styled.div`
  border-radius: 50%;
  width: 4em;
  height: 4em;
  ${props =>
    props.src &&
    `
      border: 1px solid ${props.theme.color.d3};
      background: black url(${props.src}) center center no-repeat;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    `}
`;

export const Title = styled.h4`
  margin: 0px;
  margin-bottom: 0.3em;
  font-size: 1.15em;
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

export const Centered = styled.div`
  display: flex;
  flex-direction: column;
  direction: rtl;
`;
