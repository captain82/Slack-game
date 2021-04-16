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

let workspaceUsers = {};
let gameManager;

// Attain list of the usernames in the workspace
// and map them to their userids
const slackClient = new WebClient(config.SLACK_API_TOKEN);
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
            sendMessage(sendJsonMessage(res,getWelcomeMessage()));
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

function getWelcomeMessage(){
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

app.get('/', function (req, res) {
    res.send(200);
});

app.listen(process.env.PORT || 3000);
