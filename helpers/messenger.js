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
                        "text": ":zap:"
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

function sendMessage(res,mainMessage,attachmentMessages){
    const attachments = _buildAttachments(attachmentMessages);
    const message = _buildMessage(mainMessage,attachments);
    console.log(attachments);
    console.log(message);
    res.status(200).json(ticTacInterface);
}

module.exports = sendMessage;