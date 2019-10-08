import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Spinner from '../../primitives/Spinner';
import { Avatar, UploadImage } from './style';
import { GET_IMAGE, IMAGE_UPLOAD } from '../../graphql/file';

const AvatarUpload = ({ onChange, name, value }) => {
  const { loading: loading1, data: getImageData } = useQuery(GET_IMAGE, {
    fetchPolicy: 'cache-first',
    variables: { id: value },
  });

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

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <label htmlFor="image-upload">
        <Avatar src={getImageData && getImageData.file.url} />
        <UploadImage>
          {loading1 || loading2 ? (
            <>
              {loading1 && 'Loading...'}
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
