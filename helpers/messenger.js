'use strict';

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

function sendMessage(res,mainMessage,attachmentMessages){
    const attachments = _buildAttachments(attachmentMessages);
    const message = _buildMessage(mainMessage,attachments);
    res.status(200).json(ticTacInterface);
}

function sendJsonMessage(res,json){
    res.status(200).json(json);
}

function sendInteractiveMessage(res,json){
    res.json(json);
}

module.exports = sendMessage;
module.exports = sendJsonMessage;
module.exports = sendInteractiveMessage;