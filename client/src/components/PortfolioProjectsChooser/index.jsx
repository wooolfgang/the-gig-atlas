import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import {
  Search,
  ProjectsContainer,
  SubmitContainer,
  ProjectContainer,
} from './style';
import Button from '../../primitives/Button';

/**
 * Todo => Make this component more efficient/performant
 * @param {*} param0
 */

const PortfolioProjectsChooser = ({
  visible,
  closeModal,
  projects: _projects,
  onSubmit,
}) => {
  const [chosenProjectsIndex, setChosenProjectsIndex] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  const handleSearch = useCallback(
    e => {
      const { value } = e.target;
      const projectsSearchable = _projects.map((p, i) => ({ ...p, index: i }));
      const filtered = projectsSearchable.filter(p => p.title.includes(value));
      setProjectsList(filtered);
    },
    [_projects],
  );

  useEffect(() => {
    const projectsSearchable = _projects.map((p, i) => ({ ...p, index: i }));
    setProjectsList(projectsSearchable);
  }, [_projects]);

  function handleSubmit() {
    const chosenProjects = _projects.filter(
      (p, index) => chosenProjectsIndex.includes(index),
      // eslint-disable-next-line function-paren-newline
    );
    onSubmit(chosenProjects);
    setChosenProjectsIndex([]);
    closeModal();
  }

  return (
    <div>
      <Modal
        visible={visible}
        closeModal={closeModal}
        innerModalStyle={{
          width: '600px',
          maxWidth: '100vw',
          padding: '1rem',
          boxSizing: 'border-box',
          background: 'white',
          height: '500px',
        }}
      >
        <Search
          type="search"
          onChange={handleSearch}
          placeholder="Search projects"
        />
        <p style={{ margin: '0.25rem' }}>
          {' '}
          {chosenProjectsIndex.length}{' '}
          {chosenProjectsIndex.length > 0 ? 'items' : 'item'} selected
        </p>
        <ProjectsContainer>
          {projectsList.map(p => {
            const selected = chosenProjectsIndex.includes(p.index);
            return (
              <ProjectContainer
                key={p.index}
                selected={selected}
                onClick={() => {
                  if (selected) {
                    setChosenProjectsIndex(
                      chosenProjectsIndex.filter(index => index !== p.index),
                      // eslint-disable-next-line function-paren-newline
                    );
                  } else {
                    setChosenProjectsIndex([...chosenProjectsIndex, p.index]);
                  }
                }}
              >
                <span id="project-title">{p.title}</span>
                {p.description && (
                  <span id="project-description"> - {p.description}</span>
                )}
              </ProjectContainer>
            );
          })}
        </ProjectsContainer>
        <SubmitContainer>
          <Button
            styleType="primary"
            onClick={handleSubmit}
            type="button"
            style={{ width: '150px' }}
          >
            Add Projects
          </Button>
        </SubmitContainer>
      </Modal>
    </div>
  );
};

PortfolioProjectsChooser.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default PortfolioProjectsChooser;
