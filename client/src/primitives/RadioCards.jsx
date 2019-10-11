import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputStyles } from '../utils/theme';

export const CardOptionsContainer = styled.div`
  display: flex;
`;

export const Card = styled.div`
  width: 200px;
  max-width: 30%;
  min-height: 100px;
  padding: 0.75rem 0.75rem;
  margin-right: 1rem;
  cursor: pointer;
  ${InputStyles};
`;

export const Description = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  margin: 0;
  word-wrap: break-word;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
`;

const CardOption = ({
  name,
  value,
  title,
  description,
  onChange,
  selected,
}) => (
  <Card
    selected={selected}
    tabIndex="0"
    role="button"
    aria-pressed="false"
    onClick={() => {
      onChange({ target: { name, value } });
    }}
  >
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Card>
);

CardOption.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

CardOption.defaultProps = {
  selected: false,
};

const RadioCards = ({
  options,
  onBlur,
  onChange,
  name,
  value: defaultValue,
}) => (
  <CardOptionsContainer>
    {options.map(({ value, title, description }) => (
      <CardOption
        value={value}
        title={title}
        description={description}
        name={name}
        selected={defaultValue === value}
        key={value}
        onBlur={onBlur}
        onChange={onChange}
      />
    ))}
  </CardOptionsContainer>
);

RadioCards.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

RadioCards.defaultProps = {
  options: [],
  value: null,
};

export default RadioCards;
