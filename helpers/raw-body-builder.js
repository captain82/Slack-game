'use strict';

module.exports.rawBodyBuilder = function(req,res,buffer,encoding){
    if(buffer && buffer.length){
        req.rawBody = buffer.toString(encoding||'utf-8');
    }
}