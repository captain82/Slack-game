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
    console.log(req.body.user_name);
    console.log(req.body);
    res.set('content-type', 'application/json');
    const channelId = req.body.channel_id;
    const userId = req.body.user_id;
    const params = req.body.text.split(/[ ,]+/);
    //const challenger = req.body.user_name;
    //console.log(params);
    switch (params[0]) {
        case 'play':
            sendJsonMessage(res, getWelcomeMessage(userId));
            console.log(params[1].replace('@', ''));
            gameManager.addOpponentName(params[1].replace('@', ''));
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
    const channelId = payload.channel.id;
    const userId = payload.user.id;
    //const params = payload.text.split(/[ ,]+/);
    console.log(userId);
    //console.log(params);
    //respond(ticTacInterface);

     try {
         //const board = getBoard(3);
         //respond(buildTicTacMessage(board));
         //respond(ticTacInterface);
         console.log(respond);
         play(gameManager, channelId, userId, respond);
     } catch (error) {
         console.log(error);
        // respond(ticTacInterface)
     }

    //const reply = payload.original_message;
    //delete reply.attachments[0].actions;
    //return reply;
    // Before the work completes, return a message object that is the same as the original but with
    // the interactive elements removed.
    //const reply = payload.original_message;
    //delete reply.attachments[0].actions;
    //return reply;
});

 function getBoard(size) {
    return [...new Array(size)].map((d, row) => {
        return [...new Array(size)].map((d, col) => {
            let position = _mapCoordstoMove(row, col);
            return constants.boardSymbolMap[position.toString()];
        });
    });
};

function _mapCoordstoMove(row, col) {
    return (row * 3) + col + 1;
}

function boardToString() {
    return this._board.map((row) => row.join('')).join('\n');
}

function _buildAttachments(attachmentMessages){
    let attachments = [];
    for(const message of attachmentMessages){
        attachments.push({
            'text':message
        });
    }
    return attachments;
}

function _buildMessage(mainMessage,attachments){
    return{
        'response_type':'in_channel',
        'text': mainMessage,
        'attachments':attachments
    };
}

function buildTicTacMessage(board){
    var ticTacInterfaces = {};
    ticTacInterfaces.blocks = [];
    for(var i = 0; i < board.length; i++) {
        ticTacInterfaces.blocks[i] = {};
        ticTacInterfaces.blocks[i].type="actions";
        ticTacInterfaces.blocks[i].elements = [];
        for(var j = 0; j < board[i].length; j++) {
            console.log(board[i][j]);
            ticTacInterfaces.blocks[i].elements[j] = {};
            ticTacInterfaces.blocks[i].elements[j].type = "button";
            ticTacInterfaces.blocks[i].elements[j].text = {};
            ticTacInterfaces.blocks[i].elements[j].text.type = "plain_text";
            ticTacInterfaces.blocks[i].elements[j].text.emoji = true;
            ticTacInterfaces.blocks[i].elements[j].text.text = ":zap:";
            ticTacInterfaces.blocks[i].elements[j].value = mapCoordstoMove(i,j).toString;
            ticTacInterfaces.blocks[i].elements[j].action_id = mapCoordstoMove(i,j).toString;
        }
    }
    return JSON.stringify(ticTacInterfaces)
}

function mapCoordstoMove(row, col) {
    return (row * 3) + col + 1;
}

const ticTacInterface = {
    "blocks": [
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":fencer:"
                    },
                    "action_id": "1",
                    "value": "1"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "2",
                    "value": "2"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "3",
                    "value": "3"
                }
            ]
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "4",
                    "value": "4"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "5",
                    "value": "5"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "6",
                    "value": "5"
                }
            ]
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "7",
                    "value": "6"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "8",
                    "value": "7"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": ":zap:"
                    },
                    "action_id": "9",
                    "value": "8"
                }
            ]
        }
    ]
}

function getWelcomeMessage(userId) {
    return {
        text: `<@${userId}>${constants.P1SYMBOL} is challenging you for a quick Tic Tac Toe game`,
        response_type: 'in_channel',
        attachments: [{
            text: 'Let\'s break the ice',
            callback_id: 'accept_tos',
            actions: [
                {
                    name: 'accept_tos',
                    text: ':fencer: Bring it up. :fencer:',
                    value: 'accept',
                    type: 'button',
                    style: 'primary',
                },
                {
                    name: 'accept_tos',
                    text: ':male-technologist: I am Busy :female-technologist:',
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
