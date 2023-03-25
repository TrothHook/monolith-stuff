const dotenv = require('dotenv');

dotenv.config({path: "./config.env"});

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    APP_SECRET: process.env.APP_SECRET
}