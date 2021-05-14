'use strict';

const sendMessage = require('../helpers/messenger').default;
const constants = require('../constants');

/**
* Handles userId's move if they are the current player
*
* @param gameManager {Object}
* @param channelId {string}
* @param userId {string}
* @param cmdParams {[]string} - params passed with `/ttt move` command
* @param res {Object} - the response object to post back to channel
*/
function move (gameManager, channelId, userId, cmdParams, res) {
  if (!gameManager.hasGame(channelId)) {
    sendMessage(res, constants.NO_GAME_EXISTS, []);
    return;
  }

  let game = gameManager.getGame(channelId);

  if (!game.validPlayer(userId)) {
    sendMessage(res, constants.INVALID_PLAYER, []);
    return;
  }

  if (userId !== game.getCurrentPlayer()) {
    sendMessage(res, constants.INVALID_TURN, []);
    return;
  }

  if (cmdParams.length !== 2) {
    sendMessage(res, constants.INVALID_MOVE, []);
    return;
  }

  const position = cmdParams[1];

  if (isNaN(position) || !Number.isInteger(Number(position))) {
    sendMessage(res, constants.INVALID_MOVE, []);
    return;
  }

  if (!game.validMove(position)) {
    sendMessage(res, constants.INVALID_MOVE, []);
    return;
  }

  game.addMove(position);

  const board = game.boardToString();

  if (game.isWinner()) {
    sendMessage(res, '', [board, game.getWinMsg()]);
    gameManager.removeGame(channelId);
    return;
  }

  if (game.isBoardFull()) {
    sendMessage(res, '', [board, constants.DRAW_MESSAGE]);
    gameManager.removeGame(channelId);
    return;
  }

  game.toggleCurrentPlayer();
  sendMessage(res, '', [board, game.getCurrentPlayerMsg()]);
}

module.exports = move;
