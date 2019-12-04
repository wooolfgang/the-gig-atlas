/* eslint-disable no-console */
import { Client, Pool } from 'pg';
import cfg from '../config';

const { pg } = cfg;

/**
 * Create one time conneciton client
 * usefull for db build initialization
 * call .end() to end connection
 */
export async function client() {
  const pgClient = new Client(pg);

  await pgClient.connect();

  return pgClient;
}

/**
 * Create a continous connection pooling
 * usefull for continous working system
 * call .end() to end connection
 */
export function pool() {
  const pgPool = new Pool(pg);
  pgPool.on('error', err => {
    // todo: handle connection error
    console.error('Postgres pooling error');
    console.error(err);

    process.exit(-1);
  });

  return pgPool;
}

/**
 * convert string to or query by replace spaces with "|"
 * @param {string} txt - text to convert to or query
 * @ref https://www.postgresql.org/docs/9.1/datatype-textsearch.html
 */
export function toOrQuery(txt) {
  return txt.trim().replace(/\s+/g, '|');
}

export function toAndQuery(txt) {
  return txt.trim().replace(/\s+/g, '&');
}
