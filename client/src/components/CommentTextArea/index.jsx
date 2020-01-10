import React, { useState } from 'react';
import PropTypes from 'prop-types';
import common from '@shared/common';
import { Formik, Form, Field } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_COMMENT } from '../../graphql/thread';
import CustomField from '../CustomField';
import Button from '../../primitives/Button';
import noop from '../../utils/noop';

const CommentTextArea = ({ threadId, parentId, onSubmit, onError }) => {
  const [createThread] = useMutation(CREATE_COMMENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Formik
      initialValues={{
        text: '',
        threadId,
        parentId,
      }}
      validationSchema={common.validation.commentInput}
      onSubmit={async values => {
        try {
          setIsSubmitting(true);
          const res = await createThread({
            variables: {
              input: values,
            },
          });
          onSubmit(res.data.createComment);
        } catch (e) {
          onError(e);
          console.log(e);
        }
        setIsSubmitting(false);
      }}
      render={() => (
        <Form>
          <Field
            name="text"
            component={CustomField}
            type="texteditor"
            labelStyle={{
              marginBottom: '8px',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              styleType={isSubmitting ? 'default' : 'secondary'}
              style={{ width: '100px' }}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </Form>
      )}
    />
  );
};

CommentTextArea.propTypes = {
  threadId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
};

CommentTextArea.defaultProps = {
  parentId: '',
  onSubmit: noop,
  onError: noop,
};

export default CommentTextArea;
