import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Textarea from './Textarea';
import { InputStyles } from '../utils/theme';
import debounce from '../utils/debounce';

let Trix;

if (typeof window !== 'undefined') {
  /* eslint-disable-next-line */
  require('trix/dist/trix.css');
  Trix = require('trix');
}

const TextEditorStyles = styled.div`
  trix-editor {
    ${InputStyles};
    padding: 0.2rem 0.4rem;
    min-height: 8rem;
    height: auto;
    cursor: text;
    border-radius: 0px;
  }
`;

const TextEditor = ({ onChange, onBlur, value, name, placeholder }) => {
  const trixInput = useRef(null);

  useEffect(() => {
    const handleChange = debounce(event => {
      onChange({
        target: {
          name,
          value: event.target.innerHTML,
        },
      });
    }, 1000);
    function handleBlur(event) {
      onBlur({
        target: {
          ...event.target,
          name,
        },
      });
    }
    if (trixInput) {
      trixInput.current.addEventListener('trix-change', handleChange);
      trixInput.current.addEventListener('trix-blur', handleBlur);
    }

    return () => {
      const { current } = trixInput;
      current.removeEventListener('trix-change', handleChange, false);
      current.removeEventListener('trix-blur', handleBlur, false);
    };
  }, [name, onBlur, onChange]);

  /* Use Textarea as placeholder for SSR */
  if (!Trix) {
    return <Textarea placeholder={placeholder} />;
  }

  return (
    <div key={Trix ? 1 : 0}>
      <TextEditorStyles>
        <input id="trix" type="hidden" value={value} />
        <trix-editor input="trix" ref={trixInput} />
      </TextEditorStyles>
    </div>
  );
};

TextEditor.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

TextEditor.defaultProps = {
  value: '',
  placeholder: '',
};

export default TextEditor;
