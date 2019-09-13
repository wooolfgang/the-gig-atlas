import React from 'react';
import PropTypes from 'prop-types';
import GigCard from '../GigCard';

/* 
  This is temporary hardcode-values until we have the final 
  schema from the backend 
*/

const avatars = [
  'https://randomuser.me/api/portraits/women/18.jpg',
  'https://randomuser.me/api/portraits/women/23.jpg',
  'https://randomuser.me/api/portraits/men/88.jpg',
  'https://randomuser.me/api/portraits/men/84.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/39.jpg',
];

const titles = [
  'Looking for fullstack developer',
  'I want to create awesome website',
  'ReactJS, NextJS, and a Saas Application',
  'Illustration Designer For Big Company',
];

const tech = [
  'NodeJS',
  'React',
  'Graphql',
  'Gatsby',
  'Elixir',
  'Javascript',
  'Haskell',
];
const projectTypes = ['Maintenance/Features', 'Greenfield', 'Consulting'];
const jobTypes = ['Contract', 'Full-Time', 'Part-Time'];

const random = max => Math.floor(Math.random() * max);

const GigsList = ({ gigs }) => {
  return gigs.map((g, i) => {
    const src = avatars[random(avatars.length)];
    const title = titles[random(titles.length)];
    const technologies = new Array(random(6))
      .fill(true)
      .map(() => tech[random(tech.length)]);
    const projectType = projectTypes[random(projectTypes.length)];
    const jobType = jobTypes[random(jobTypes.length)];

    const gig = {
      id: i,
      ...g,
      avatarSrc: src,
      title,
      technologies,
      postedAt: new Date().toISOString(),
      projectType,
      jobType,
      location: 'Remote',
    };
    return <GigCard key={gig.id} {...gig} margin="0 0 12px 0" />;
  });
};

GigsList.propTypes = {
  gigs: PropTypes.arrayOf({
    title: PropTypes.string,
    postedAt: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
};

GigsList.defaultProps = {
  gigs: [],
};

export default GigsList;
