import React from 'react';
import PropTypes from 'prop-types';
import { CardOptionsContainer, Card, Description, Title } from './style';

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
    })
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
