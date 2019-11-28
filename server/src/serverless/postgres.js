/* eslint-disable no-console */
import { Client, Pool } from 'pg';
import config from '../config';

const { pg } = config;

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
 * usefull for working system
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
