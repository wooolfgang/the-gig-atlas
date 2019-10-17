import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import Spinner from '../../primitives/Spinner';
import { Avatar, UploadImage } from './style';
import { GET_IMAGE, IMAGE_UPLOAD } from '../../graphql/file';

const AvatarUpload = ({ onChange, onBlur, name, value }) => {
  const [fetchImage, { loading: loading1, data: getImageData }] = useLazyQuery(
    GET_IMAGE,
    {
      fetchPolicy: 'cache-first',
      variables: { id: value },
    },
  );
  const [uploadImage, { error: queryError, loading: loading2 }] = useMutation(
    IMAGE_UPLOAD,
    {
      update(
        cache,
        {
          data: { uploadImage: res },
        },
      ) {
        const variables = { id: res.id };
        cache.writeQuery({
          query: GET_IMAGE,
          data: { file: res },
          variables,
        });
        onChange({ target: { name, value: res ? res.id : null } });
      },
    },
  );

  useEffect(() => {
    if (value && !loading1 && !loading2) {
      fetchImage();
    }
  }, [fetchImage, loading1, loading2, value]);

  const [error, setError] = useState(queryError && queryError.toString());

  function validateSize(file) {
    const mbInBytes = 1 * 10 ** 6;
    const size = 10 * mbInBytes;
    if (!file) return false;
    if (file.size > size) {
      setError(`File size is over the ${size / mbInBytes}mb limit`);
      return false;
    }
    return true;
  }

  function validateType(file) {
    const { type } = file;
    if (!type.match(/image/g)) {
      setError('Invalid image format');
      return false;
    }
    return true;
  }

  async function handleChange(e) {
    const file = e.target.files[0];
    if (validateSize(file) && validateType(file)) {
      await uploadImage({ variables: { file } });
      setError(null);
    }
  }

  function handleBlur(e) {
    onBlur({
      target: {
        ...e.target,
        name,
      },
    });
  }

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <label htmlFor="image-upload">
        <Avatar
          src={getImageData && getImageData.file.url}
          tabIndex={0}
          onBlur={handleBlur}
          onSelect={handleBlur}
        />
        <UploadImage>
          {loading1 || loading2 ? (
            <>
              {loading2 && 'Uploading...'}
              <Spinner />
            </>
          ) : (
            <>
              Upload
              <img
                src="/static/upload.svg"
                alt="upload-icon"
                style={{ width: '.8rem', marginLeft: '0.2rem' }}
              />
            </>
          )}
        </UploadImage>
      </label>
      {error && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{error}</span>
      )}
    </div>
  );
};

AvatarUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
};

AvatarUpload.defaultProps = {
  value: null,
};

export default AvatarUpload;
