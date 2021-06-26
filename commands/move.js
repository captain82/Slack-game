'use strict';

const sendMessage = require('../helpers/messenger').default;
const constants = require('../constants');

function move (gameManager, channelId, userId, position) {
 
  const game = gameManager.getGame(channelId);

   if (!game.validPlayer(userId)) {
     sendMessage(res, constants.INVALID_PLAYER, []);
     return;
   }

   if (userId !== game.getCurrentPlayer()) {
     sendMessage(res, constants.INVALID_TURN, []);
     return;
   }



  console.log(position);
  game._addMove(position);

  if (game.isWinner()) {
    //game.toggleCurrentPlayer();
    const attachments = buildAttachments([game.getWinMsg()]);
    const message = buildMessage('',attachments);
    //sendMessage(res, '', [board, game.getWinMsg()]);
    gameManager.removeGame(channelId);
    console.log(message);
    return message;
  }

  const board = game._buildTicTacMessage();
  game.toggleCurrentPlayer();
  return board;
}

function buildAttachments(attachmentMessages){
  let attachments = [];
  for(const message of attachmentMessages){
      attachments.push({
          'text':message
      });
  }
  return attachments;
}

function buildMessage(mainMessage,attachments){
  return{
      'response_type':'in_channel',
      'text': mainMessage,
      'attachments':attachments
  };
}

module.exports = move;
