'use strict';

const bodyParser = require('body-parser');
const constants = require('./constants');
const express = require('express');
const { WebClient } = require('@slack/client');
const config = require('./config');
const { move, play, end, status, help } = require('./commands/index');
const { verifySlackSigningSecret } = require('./middleware/authorization');
const { rawBodyBuilder } = require('./helpers/raw-body-builder');
const GameManager = require('./lib/game-manager');
const sendMessage = require('./helpers/messenger');
const sendJsonMessage = require('./helpers/messenger');
const { createMessageAdapter } = require('@slack/interactive-messages');

let workspaceUsers = {};
let gameManager;

// Attain list of the usernames in the workspace
// and map them to their userids
const slackClient = new WebClient(config.SLACK_API_TOKEN);
const slackInteractions = createMessageAdapter(config.SIGNING_SECRET);


slackClient.users.list().then((res) => {
    for (const user of res.members) {
        console.log(user);
        workspaceUsers[user.name] = user.id;
    }
    gameManager = new GameManager(workspaceUsers);
}).catch((err) => {
    console.log(err);
});

var app = express();
app.use('/slack/actions', slackInteractions.expressMiddleware());
app.use(bodyParser.json({ verify: rawBodyBuilder }));
app.use(bodyParser.urlencoded({ verify: rawBodyBuilder, extended: true }));
app.use(bodyParser.raw({ verify: rawBodyBuilder, type: () => true }));
app.use(verifySlackSigningSecret);

app.post('/slack/commands', (req, res) => {
    console.log("checking");
    res.set('content-type', 'application/json');
    const channelId = req.body.channel_id;
    const userId = req.body.user_id;
    const params = req.body.text.split(/[ ,]+/);
    switch (params[0]) {
        case 'play':
            sendJsonMessage(res, getWelcomeMessage());
            //play(gameManager, channelId, userId, params, res);
            break;
        case 'status':
            status(gameManager, channelId, res);
            break;
        case 'move':
            move(gameManager, channelId, userId, params, res);
            break;
        case 'end':
            end(gameManager, channelId, userId, res);
            break;
        case 'help':
            help(res);
            break;
        default:
            res.status(200).send(constants.INVALID_COMMAND);
            break;
    }
});

slackInteractions.action('accept_tos', (payload, respond) => {
    console.log("hurray");
    console.log(`The user ${payload.user.name} in team ${payload.team.domain} pressed a button`);
    console.log(payload);
    //const channelId = payload.body.channel_id;
    //const userId = payload.body.user_id;
    //const params = payload.body.text.split(/[ ,]+/);
    //console.log(userId);
    //console.log(params);


    return respond.status(200).json(getWelcomeMessag2());
    // Before the work completes, return a message object that is the same as the original but with
    // the interactive elements removed.
    //const reply = payload.original_message;
    //delete reply.attachments[0].actions;
    //return reply;
});

function getWelcomeMessage() {
    return {
        text: 'You are about to start the most terrific game of the entire gaming history',
        response_type: 'in_channel',
        attachments: [{
            text: 'Buckle up fellas',
            callback_id: 'accept_tos',
            actions: [
                {
                    name: 'accept_tos',
                    text: 'Bring it up to me',
                    value: 'accept',
                    type: 'button',
                    style: 'primary',
                },
                {
                    name: 'accept_tos',
                    text: 'Leave it, i am afraid',
                    value: 'deny',
                    type: 'button',
                    style: 'danger',
                },
            ],
        }],
    }
}

function getWelcomeMessag2() {
    return {
        text: 'You are about to start the best terrific game of the entire gaming history',
        response_type: 'in_channel',
        attachments: [{
            text: 'Buckle up fellas',
            callback_id: 'accept_tos',
            actions: [
                {
                    name: 'accept_tos',
                    text: 'Bring it up to me',
                    value: 'accept',
                    type: 'button',
                    style: 'primary',
                },
                {
                    name: 'accept_tos',
                    text: 'Leave it, i am afraid',
                    value: 'deny',
                    type: 'button',
                    style: 'danger',
                },
            ],
        }],
    }
}

app.get('/', function (req, res) {
    res.send(200);
});

app.listen(process.env.PORT || 3000);
