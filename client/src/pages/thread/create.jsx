import React, { useState } from 'react';
import styled from 'styled-components';
import common from '@shared/common';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import CustomField from '../../components/CustomField';
import Nav from '../../components/Nav';
import Button from '../../primitives/Button';
import { CREATE_THREAD, GET_THREAD_TAGS } from '../../graphql/thread';

const Container = styled.div`
  height: calc(100vh - 67.5px);
  padding-top: 1rem;
  box-sizing: border-box;
`;

const Main = styled.main`
  margin: auto;
  width: 800px;
  max-width: 95vw;
`;

const ThreadCreate = () => {
  const [createThread] = useMutation(CREATE_THREAD);
  const { data: threadTags } = useQuery(GET_THREAD_TAGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div>
      <Nav type="AUTHENTICATED_FREELANCER" />
      <Container>
        <Main>
          <h1>
            Create a thread
            <span
              role="img"
              aria-label="thread-emoji"
              style={{ fontSize: 'inherit' }}
            >
              {' '}
              💬
            </span>
          </h1>
          <Formik
            initialValues={{
              title: '',
              body: '',
              tags: [],
            }}
            validationSchema={common.validation.threadInput}
            onSubmit={async values => {
              try {
                setIsSubmitting(true);
                const res = await createThread({
                  variables: { input: values },
                });
                const threadId = res.data.createThread.id;
                Router.push(`/thread/${threadId}`);
              } catch (e) {
                setIsSubmitting(false);
              }
            }}
            render={() => (
              <Form>
                <Field
                  component={CustomField}
                  type="text"
                  name="title"
                  placeholder="What are your freelancing holy grails?"
                  label="Title"
                />
                <Field
                  label="Body"
                  component={CustomField}
                  type="texteditor"
                  name="body"
                />
                <Field
                  component={CustomField}
                  label="Tag"
                  type="select"
                  name="tags"
                  placeholder="Select tags"
                  searchable={false}
                  isMulti
                  options={
                    threadTags &&
                    threadTags.threadTags.map(t => ({ label: t, value: t }))
                  }
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    styleType="primary"
                    style={{ width: '175px' }}
                    type="submit"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Thread'}
                  </Button>
                </div>
              </Form>
            )}
          />
        </Main>
      </Container>
    </div>
  );
};

export default ThreadCreate;
