import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

// eslint-disable-next-line object-curly-newline
const HTMLHead = ({ title, description, og, twitter }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {og && (
      <>
        <meta property="og:type" content={og.type} />
        <meta property="og:title" content={og.title} />
        <meta property="og:description" content={og.description} />
        <meta property="og:image" content={og.image} />
        <meta property="og:url" content={og.url} />
        <meta property="og:site_name" content={og.siteName} />
      </>
    )}
    {twitter && (
      <>
        <meta name="twitter:title" content={twitter.title} />
        <meta name="twitter:description" content={twitter.description} />
        <meta name="twitter:image" content={twitter.image} />
        <meta name="twitter:site" content={twitter.site} />
        <meta name="twitter:creator”" content={twitter.creator} />
      </>
    )}
  </Head>
);

HTMLHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  og: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    siteName: PropTypes.string,
  }),
  twitter: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    site: PropTypes.string,
    creator: PropTypes.string,
  }),
};

HTMLHead.defaultProps = {
  title:
    'The Gig Atlas - The next generation gig platform built for freelancers',
  description:
    'The Gig Atlas is a gig platform that aims to empower freelancers',
  og: null,
  twitter: null,
};

export default HTMLHead;
