export function setAuthorization(token) {
  return `Bearer ${token}`;
}

export function getToken(authorization) {
  if (!authorization) {
    throw new Error('No Authorization Header');
  }

  const token = authorization.substr(7);

  if (!token || token === '') {
    throw new Error(`Invalid authorization. Input: ${authorization}`);
  }

  return token;
}
