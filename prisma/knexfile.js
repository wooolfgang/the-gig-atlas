/* eslint-disable prefer-template */
// Update with your config settings.
const result = require('dotenv').config();

if (result.error) {
  throw result.error
}

// eslint-disable-next-line prettier/prettier
const {
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_DATABASE,
  PG_PORT, // string type port seems fine
} = process.env;

const connection = {
  user: PG_USER,
  password: PG_PASSWORD,
  host: PG_HOST,
  database: PG_DATABASE,
  port: PG_PORT,
};

module.exports = {
  development: {
    connection,
    client: 'postgresql',
  },

  staging: {
    connection,
    client: 'postgresql',
    pool: {
      min: 2,
      max: 10,
    },
    // migrations: {
    //   tableName: 'knex_migrations',
    // },
  },

  production: {
    connection,
    client: 'postgresql',
    pool: {
      min: 2,
      max: 10,
    },
    // migrations: {
    //   tableName: 'knex_migrations',
    // },
  },
};
