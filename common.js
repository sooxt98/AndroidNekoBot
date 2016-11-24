var Config = require('./config');

exports.CheckBlock = function(msg) {
    var username = msg.from.username
    var Blocked = (block.indexOf(username) > -1)
    if (Blocked) 
        return
    else
        return false
}

exports.IsOwner = function(msg) {
    console.log(msg.from.id)
    console.log('Owner :',Config.OwnerId)
    if (msg.from.id == Config.OwnerId)
        return true
    else
        return false
}


