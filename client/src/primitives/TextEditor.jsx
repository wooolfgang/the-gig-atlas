import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextArea from './TextArea';
import { InputStyles } from '../utils/theme';

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

const TextEditor = ({
  onChange,
  onBlur,
  value,
  name,
  placeholder,
  hasError,
}) => {
  const trixId = useRef(Math.random().toString(36));
  const mounted = useRef(false);

  useEffect(() => {
    const handleChange = event => {
      // Set mounted current to true, which stops trix-editor from loadingHTML
      mounted.current = true;
      onChange({
        target: {
          name,
          value: event.target.innerHTML,
        },
      });
    };

    const handleBlur = event => {
      onBlur({
        target: {
          ...event.target,
          name,
        },
      });
    };

    const trix = document.getElementById(trixId.current);
    if (trix) {
      if (!mounted.current && value) {
        trix.editor.loadHTML(value);
        mounted.current = true;
      }

      trix.addEventListener('trix-blur', handleBlur);
      trix.addEventListener('trix-change', handleChange);
    }

    return () => {
      if (trix) {
        trix.removeEventListener('trix-blur', handleBlur, false);
        trix.removeEventListener('trix-change', handleChange, false);
      }
    };
  }, [name, onBlur, onChange, value]);

  /* Use Textarea as placeholder for SSR */
  if (!Trix) {
    return <TextArea placeholder={placeholder} />;
  }

  return (
    <div>
      <TextEditorStyles hasError={hasError}>
        <input id="trix" type="hidden" value={value} />
        <trix-editor input="trix" id={trixId.current} />
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
  hasError: PropTypes.bool,
};

TextEditor.defaultProps = {
  value: '',
  placeholder: '',
  hasError: false,
};

export default TextEditor;
