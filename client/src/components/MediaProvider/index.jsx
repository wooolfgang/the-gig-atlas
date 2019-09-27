import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sizes } from '../../utils/media';
import debounce from '../../utils/debounce';

const isClient = !!process.browser;

function useMedia(initialValue, config = { debounceTime: null }) {
  const { debounceTime } = config;
  const { isMobile } = initialValue;

  let initialWidth = isClient && document.body.clientWidth;
  let initialHeight = isClient && document.body.clientHeight;

  if (!isClient) {
    initialWidth = isMobile ? sizes.phone : sizes.giant;
    initialHeight = isMobile ? sizes.phone : sizes.giant;
  }

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

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

const MediaProvider = ({ children, value }) => {
  const media = useMedia(value);
  return (
    <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  value: PropTypes.shape({
    isMobile: PropTypes.bool,
  }),
  children: PropTypes.element.isRequired,
};

MediaProvider.defaultProps = {
  value: null,
};

const MediaConsumer = MediaContext.Consumer;

export { MediaConsumer, MediaProvider, useMedia };
