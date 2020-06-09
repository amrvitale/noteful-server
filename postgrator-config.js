'use strict';

require('dotenv').config();

const setDatabaseUrl = (env) => {
  if (env === 'production') {
    return process.env.PROD_DATABASE_URL;
  } else if (env === 'development') {
    return process.env.DEV_DATABASE_URL;
  } else {
    return process.env.TEST_DATABASE_URL;
  }
};
console.log(process.env.TEST_DATABASE_URL, "test DB URL")

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
     ? process.env.TEST_DATABASE_URL
     : process.env.DATABASE_URL,
     "ssl": !!process.env.SSL,
}