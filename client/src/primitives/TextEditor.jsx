import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Textarea from './Textarea';
import { InputStyles } from '../utils/theme';
import debounce from '../utils/debounce';

let Trix;

if (typeof window !== 'undefined') {
  /* eslint-disable-next-line */
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
  const onChangeDebounced = debounce(onChange, 2000);
  const trixInput = useRef(null);

  useEffect(() => {
    if (trixInput) {
      trixInput.current.addEventListener('trix-change', event => {
        onChangeDebounced({
          target: {
            name,
            value: event.target.innerHTML,
          },
        });
      });
      trixInput.current.addEventListener('trix-blur', event => {
        onBlur({
          target: {
            ...event.target,
            name,
          },
        });
      });
    }

    return (
      trixInput &&
      (() => {
        trixInput.current.removeEventListener(
          'trix-change',
          () => console.log('Removed trix listener'),
          false,
        );
        trixInput.current.removeEventListener(
          'trix-blur',
          () => console.log('Removed blur listener'),
          false,
        );
      })
    );
  });

  /* Use Textarea as placeholder for SSR */
  if (!Trix) {
    return <Textarea placeholder={placeholder} />;
  }

  return (
    <div key={Trix ? 1 : 0}>
      <TextEditorStyles>
        <input id="trix" type="hidden" value={value} />
        <trix-editor input="trix" ref={trixInput} placeholder={placeholder} />
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
