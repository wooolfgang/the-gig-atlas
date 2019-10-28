export function setAuthorization(token) {
  return `Bearer ${token}`;
}

/**
 * Get the token from Authorization
 * @param {string} authorization Authorization header value
 * @returns {string | undefined} returns token if exist
 */
export function getToken(authorization) {
  if (!authorization) {
    return undefined;
  }

  const token = authorization.substr(7);

  if (!token || token === '') {
    return undefined;
  }

  return token;
}
