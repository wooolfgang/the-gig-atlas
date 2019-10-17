import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Container, Label, ImagesContainer } from './style';
import { IMAGE_UPLOAD } from '../../graphql/file';
import Spinner from '../../primitives/Spinner';

const PortfolioImagesUploader = ({ onUpload, style }) => {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadImage] = useMutation(IMAGE_UPLOAD);

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        if (inputRef) {
          inputRef.current.click();
        }
      }
    }

    const ref = buttonRef.current;
    ref.addEventListener('keyup', handleKeyPress);
    ref.addEventListener('keypress', handleKeyPress);

    return () => {
      ref.removeEventListener('keyup', handleKeyPress);
      ref.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  function validateSize(file) {
    const mbInBytes = 1 * 10 ** 6;
    const size = 10 * mbInBytes;
    if (!file) return false;
    if (file.size > size) {
      const err = `File size is over the ${size / mbInBytes}mb limit`;
      setError(err);
      throw new Error(err);
    }
    return true;
  }

  function validateType(file) {
    const { type } = file;
    if (!type.match(/image/g)) {
      const err = 'Invalid image format';
      setError(err);
      throw err;
    }
    return true;
  }

  async function handleChange(e) {
    const { files } = e.target;
    const promises = [];
    setUploading(true);
    Array.from(files).forEach(file => {
      if (validateSize(file) && validateType(file)) {
        promises.push(uploadImage({ variables: { file } }));
      }
    });
    try {
      const res = await Promise.all(promises);
      const imgs = res.map(r => r.data.uploadImage);
      const newImages = [...images, ...imgs];
      setImages(newImages);
      onUpload(newImages);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  }

  return (
    <Container style={style}>
      <Label
        htmlFor="file-upload"
        className="custom-file-upload"
        role="button"
        aria-controls="filename"
        tabIndex="0"
        ref={buttonRef}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {uploading ? (
            <>
              Uploading... <Spinner />
            </>
          ) : (
            ' Upload Images'
          )}
        </span>
        <input
          id="file-upload"
          type="file"
          multiple
          ref={inputRef}
          onChange={handleChange}
        />
      </Label>
      <ImagesContainer>
        {images &&
          images.map(img => (
            <a
              href={img.url}
              style={{ marginBottom: '.25rem' }}
              target="_blank"
              rel="noopener noreferrer"
              key={img.url}
            >
              {img.name}
            </a>
          ))}
      </ImagesContainer>
    </Container>
  );
};

PortfolioImagesUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
};

PortfolioImagesUploader.defaultProps = {
  style: {},
};

export default PortfolioImagesUploader;
