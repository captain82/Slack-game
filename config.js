'use strict';

const dotenv = require('dotenv');
dotenv.load();

function initializeConfig() {
    return Object.freeze({
        SLACK_API_TOKEN: process.env.FURLENCO_SLACK_ACCESS_TOKEN,
        SIGNING_SECRET: process.env.FURLENCO_SLACK_SIGNING_SECRET
    });
}

module.exports = initializeConfig();