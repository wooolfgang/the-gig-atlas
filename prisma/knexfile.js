/* eslint-disable prefer-template */
// Update with your config settings.
const result = require('dotenv').config();

if (result.error) {
  throw result.error;
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

/**
 * Migrations => http://knexjs.org/#Migrations

Once you have finished writing the migrations, you can update
  the database matching your NODE_ENV by running:

$ knex migrate:latest

You can also pass the --env flag or set NODE_ENV to select an alternative environment:

$ knex migrate:latest --env production

# or

$ NODE_ENV=production knex migrate:latest

To rollback the last batch of migrations:

$ knex migrate:rollback

To rollback all the completed migrations:

$ knex migrate:rollback --all

To run the next migration that has not yet been run

$ knex migrate:up

To run the specified migration that has not yet been run

$ knex migrate:up 001_migration_name.js

To undo the last migration that was run

$ knex migrate:down

To undo the specified migration that was run

$ knex migrate:down 001_migration_name.js

To list both completed and pending migrations:

$ knex migrate:list
 */
