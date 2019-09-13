import styled from 'styled-components';

export const Card = styled.div`
  height: 111px;
  padding: 12px;
  box-sizing: border-box;
  background: ${props => props.theme.color.d6};
  display: flex;
  transition: all 200ms ease-in-out;

  :focus,
  :hover {
    transform: translateY(-2px);
    box-shadow: 2px 0px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const Avatar = styled.img`
  border-radius: 50%;
  width: 63px;
  height: 63px;
`;

export const Title = styled.h4`
  margin: 0px;
  margin-bottom: 8px;
`;

export const Row = styled.div`
  width: ${props => props.width};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Tech = styled.small`
  background-color: ${props => props.theme.color.p2};
  margin-left: 4px;
  padding: 3px 5px;
  box-sizing: border-box;
`;
