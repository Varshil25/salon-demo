
const pg = require('pg');
module.exports = {
    HOST: "ep-misty-mountain-a4tj0357-pooler.us-east-1.aws.neon.tech",
    USER: "default",
    PASSWORD: "X3eEbA8tcwlp",
    DB: "verceldb",
    dialect: "postgres",
    dialectModule:pg,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds,
       ssl: {
         require: true,
        rejectUnauthorized: false
      },
      options: {
        sslmode: "require" // Setting sslmode in the options
      }
    }
  };