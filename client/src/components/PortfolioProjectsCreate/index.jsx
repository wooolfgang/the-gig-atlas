import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import common from '@shared/common';
import PropTypes from 'prop-types';
import { Button, Input, FieldError } from '../../primitives';
import { color } from '../../utils/theme';
import Modal from '../Modal';
import CustomField from '../CustomField';
import PorfolioImagesUploader from '../PortfolioImagesUploader';
import { PortfolioContainer, PortfolioCard } from './style';
import PortfolioProjectsChooser from '../PortfolioProjectsChooser';

async function fetchGithubProjects(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const projects = await res.json();
  return projects;
}

function parseGithubProjects(projects) {
  return projects.map(project => ({
    title: project.name,
    description: project.description,
    images: [],
  }));
}

const PortfolioProjectsCreate = ({ onChange, portfolio }) => {
  const [githubUsername, setGithubUsername] = useState(null);
  const [githubProjects, setGithubProjects] = useState([]);
  const [githubError, setGithubError] = useState(null);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalGithubOpen, setIsModalGithubOpen] = useState(false);

  async function fetchGithub() {
    setIsFetchingGithub(true);
    const res = await fetchGithubProjects(githubUsername);

    if (res.message === 'Not Found') {
      setGithubError('Github username does not exist');
      setIsFetchingGithub(false);
      return;
    }

    const projects = parseGithubProjects(res);
    setGithubProjects(projects);
    setIsFetchingGithub(false);
    setIsModalGithubOpen(true);
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Input
          placeholder="wooolfgang"
          style={{ width: '250px' }}
          onChange={e => {
            setGithubError('');
            setGithubUsername(e.target.value);
          }}
          onKeyDown={e => {
            e.stopPropagation();
            if (e.keyCode === 13) {
              fetchGithub();
            }
          }}
        />
        <Button
          style={{
            backgroundColor: '#24292e',
            color: 'white',
            maxWidth: '175px',
          }}
          onClick={fetchGithub}
          loading={isFetchingGithub}
          disabled={!githubUsername}
        >
          {isFetchingGithub ? 'Fetching...' : 'Get From Github'}
        </Button>
      </div>
      <FieldError value={githubError} visible={!!githubError} />
      {!githubError && (
        <small> Populate your portfolio with open source projects </small>
      )}
      <div style={{ padding: '1rem 0', boxSizing: 'border-box' }}>
        <Button
          style={{
            width: '200px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'inset 0px 4px 20px rgba(0, 0, 0, 0.05)',
            background: `${color.d6}`,
            border: `1px solid ${color.d4}`,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Add Portfolio
          <img
            src="/static/plus.svg"
            alt="plus-icon"
            style={{ width: '1rem' }}
          />
        </Button>
        <Modal
          visible={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          innerModalStyle={{
            width: '700px',
            maxWidth: '100vw',
            padding: '1rem',
            boxSizing: 'border-box',
            background: 'white',
            height: 'auto',
          }}
        >
          <Formik
            initialValues={{
              title: '',
              description: '',
              url: '',
              images: [],
            }}
            onSubmit={values => {
              onChange([...portfolio, values]);
              setIsModalOpen(false);
            }}
            validationSchema={common.validation.portfolioInput}
            render={({ setFieldValue, submitForm }) => (
              <div>
                <Field
                  name="title"
                  label="Title"
                  placeholder="Instagram Clone Application"
                  labelStyle={{ marginBottom: '.75rem' }}
                  component={CustomField}
                />
                <Field
                  name="url"
                  label="Website Url"
                  placeholder="https://www.instagramclone.com"
                  labelStyle={{ marginBottom: '.75rem' }}
                  component={CustomField}
                />
                <Field
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Created an instagram clone application built with react and love <3"
                  labelStyle={{ marginBottom: '.75rem' }}
                  component={CustomField}
                />
                <PorfolioImagesUploader
                  style={{ marginTop: '1rem' }}
                  onUpload={
                    images =>
                      setFieldValue(
                        'images',
                        images.map(img => ({ id: img.id })),
                      )
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    style={{ width: '125px' }}
                    styleType="primary"
                    onClick={submitForm}
                  >
                    Add Portfolio
                  </Button>
                </div>
              </div>
            )}
          />
        </Modal>
        <PortfolioProjectsChooser
          visible={isModalGithubOpen}
          projects={githubProjects}
          closeModal={() => setIsModalGithubOpen(false)}
          onSubmit={projects => {
            onChange(projects);
          }}
        />
      </div>
      <PortfolioContainer>
        {portfolio.map((project, index) => (
          <PortfolioCard key={index}>
            <div
              style={{
                position: 'absolute',
                right: '0px',
                top: '0px',
              }}
            >
              <Button
                style={{ outline: 'none' }}
                onClick={() => {
                  onChange(portfolio.filter((proj, i) => i !== index));
                }}
              >
                <img
                  src="/static/delete.svg"
                  alt="delete-button"
                  style={{ width: '1rem' }}
                />
              </Button>
            </div>
            <span id="project-title">{project.title}</span>
            <span id="project-description"> {project.description}</span>
          </PortfolioCard>
        ))}
      </PortfolioContainer>
    </div>
  );
};

PortfolioProjectsCreate.propTypes = {
  onChange: PropTypes.func.isRequired,
  portfolio: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
};

PortfolioProjectsCreate.defaultProps = {
  portfolio: [],
};

export default PortfolioProjectsCreate;
