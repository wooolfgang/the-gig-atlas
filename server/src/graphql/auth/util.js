import jwt from 'jsonwebtoken';
import config from '../../config';

/**
 * Async utility function to create new JWT
 * @param {Object} payload contains value for jwt
 */
export function jwtSign(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, config.secretUser, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Creates new token with provided payload values
 * @param {String} id user's id
 * @param {String} role role of user
 */
export async function createAuth(id, role) {
  const token = await jwtSign({ id, role });

  return {
    id,
    token,
  };
}
