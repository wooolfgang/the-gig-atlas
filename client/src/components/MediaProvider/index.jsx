import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sizes } from '../../utils/media';
import debounce from '../../utils/debounce';

const isClient = !!process.browser;

function useMedia(config = { debounceTime: null }) {
  const { debounceTime } = config;
  const [width, setWidth] = useState(
    isClient ? document.body.clientWidth : sizes.giant
  );
  const [height, setHeight] = useState(
    isClient ? document.body.clientHeight : sizes.giant
  );

  function onMediaChange() {
    setWidth(document.body.clientWidth);
    setHeight(document.body.clientHeight);
  }

  const handleMediaChange = debounceTime
    ? debounce(onMediaChange, debounceTime)
    : onMediaChange;

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', handleMediaChange);
      return () => window.removeEventListener('resize', handleMediaChange);
    }
    return null;
  }, [handleMediaChange]);

  let size;

  if (width <= sizes.xsPhone) {
    size = 'xsPhone';
  } else if (width <= sizes.phone) {
    size = 'phone';
  } else if (width <= sizes.tablet) {
    size = 'tablet';
  } else if (width <= sizes.desktop) {
    size = 'desktop';
  } else {
    size = 'giant';
  }

  return {
    width,
    height,
    size,
  };
}

const MediaContext = React.createContext({});

const MediaProvider = ({ children }) => {
  const media = useMedia();
  return (
    <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

const MediaConsumer = MediaContext.Consumer;

export { MediaConsumer, MediaProvider, useMedia };
