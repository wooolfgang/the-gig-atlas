/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
import axios from 'axios';

/**
 *  Returns functions that handles post request that handles debugging
 * @param {string} url The axios input url
 * @param {object} headers the axios input config
 * @returns {Function} returns functions that handles request
 */
export function createDebugPost(url, config = {}) {
  return async (reqData, extraConfig = {}, hasDebug = true) => {
    const config3 = { ...config, ...extraConfig };
    const { data } = await axios.post(url, reqData, config3);
    if (data.errors) {
      const e = data.errors[0];
      const error = new Error(e.message);
      error.details = JSON.stringify(e);

      if (hasDebug) {
        console.error(e);
      }

      throw error;
    }

    return data.data;
  };
}

export function createDebugGet(url, config = {}) {
  return async (query, extraConfig = {}, hasDebug = true) => {
    const config3 = { ...config, ...extraConfig };
    const currentQ = `${url}${query}`;
    const { data } = await axios.get(currentQ, config3);

    if (data.errors) {
      const e = data.errors[0];
      const error = new Error(e.message);
      error.details = JSON.stringify(e);

      if (hasDebug) {
        console.error(e);
      }

      throw error;
    }

    return data.data;
  };
}

export default {
  createDebugPost,
  createDebugGet,
};
