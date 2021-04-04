'use strict';

const config = require('../config');
const crypto = require('crypto');

module.exports.verifySlackSigningSecret = function (req, res, next) {
    if (req.headers['x-slack-signature']) {
        const slackSignature = req.headers['x-slack-signature'];
        const slackTimestamp = req.headers['x-slack-request-timestamp'];
        const sigBaseString = `v0:${slackTimestamp}:${req.rawBody}`;
        const hmac = crypto.createHmac('sha256', config.SIGNING_SECRET);
        const hmacSignature = `v0=${hmac.update(sigBaseString).digest('hex')}`;
        console.log(hmacSignature);
        console.log(slackSignature);
        if (hmacSignature == slackSignature) {
            next();
            return;
        }
    } v
    res.status(401).json({ error: 'Unauthorized client request' });
};