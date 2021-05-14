'use strict';

const sendMessage = require('../helpers/messenger').default;
const sendJsonMessage = require('../helpers/messenger').default;
const sendInteractiveMessage = require('../helpers/messenger').default;


const constants = require('../constants');

/**
* Starts new game between userId and opponent included in cmdParams
* if game doesn't already exist in channel and opponent is a valid player
*
* @param gameManager {Object}
* @param channelId {string}
* @param userId {string}
* @param res {Object} - the response object to post back to channel
*/
function play (gameManager, channelId, userId, respond) {
  // if (cmdParams.length !== 2 || cmdParams[1][0] !== '@') {
  //   sendMessage(res, constants.INVALID_PLAY_REQUEST, []);
  //   return;
  // }

  // if (gameManager.hasGame(channelId)) {
  //   sendMessage(res, constants.GAME_ALREADY_EXISTS, []);
  //   return;
  // }

  //const opponentName = cmdParams[1].replace('@', '');
  const opponentName = gameManager.getOpponentName();

  // if (!gameManager.hasUser(opponentName)) {
  //   sendMessage(res, constants.OPPONENT_NOT_IN_CHANNEL, []);
  //   return;
  // }

  const opponentId = gameManager.getUserId(opponentName);
  gameManager.addGame(channelId, userId, opponentId);

  const game = gameManager.getGame(channelId);
  const board = game._buildTicTacMessage();
  return board;
  //const headlineMsg = game.getHeadlineMsg();
  //const currentPlayerMsg = game.getCurrentPlayerMsg();
  //sendInteractiveMessage(respond,board);
  //sendMessage(res, headlineMsg, [board, currentPlayerMsg]);
}

module.exports = play;
