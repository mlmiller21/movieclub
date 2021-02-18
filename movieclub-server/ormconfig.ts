module.exports = [
    {
      "name": "development",
      "type": "postgres",
      "host": "localhost",
      "username": "postgres",
      "password": "postgres",
      "database": "movieclub",
      "synchronize": true,
      "logging": true,
      "entities": ["dist/entities/**/*.js"],
      "migrations": ["dist/migration/**/*.js"],
      "subscribers": ["dist/subscriber/**/*.js"]
    },
    {
      "name": "test",
      "type": "postgres",
      "host": "localhost",
      "username": "postgres",
      "password": "postgres",
      "database": "movieclub_test",
      "synchronize": true,
      "logging": true,
      "dropSchema": false,
      "entities": ["dist/entities/**/*.js"],
      "migrations": ["dist/migration/**/*.js"],
      "subscribers": ["dist/subscriber/**/*.js"]
    }
  ]