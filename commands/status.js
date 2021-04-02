'use strict';

const sendMessage = require('../helpers/messenger');
const constants = require('../constants');


function status(gameManager, channelId, res) {

    if (!gameManager.hasGame(channelId)) {
        sendMessage(res, constants.NO_GAME_EXISTS, []);
        return;
    }

    const game = gameManager.getGame(channelId);
    const board = game.boardToString();
    const headlineMsg = game.getHeadLineMsg();
    const currentPlayerMsg = game.getCurrentPlayerMsg();

    sendMessage(res,headlineMsg,[board,currentPlayerMsg]);
}

module.exports = status;