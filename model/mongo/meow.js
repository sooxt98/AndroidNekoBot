var Mongoose = require('mongoose');
require('../index');

var Meow = Mongoose.model('Meow');
//var Cat = require('../cat');

exports.Save = function(uid, cat) {
    Meow.find({ uid: uid }, function(err, result) {
        //console.log(JSON.stringify(result, null, 4));
        //console.log("UID: ",result[0].uid);
        Meow.update({ "uid": uid }, { "$set": { "waiting": false }, "$push": { "collect": cat } }, function(err, result) {
            console.log('Update User | save status:', err ? 'failed' : 'success');
            //console.log(JSON.stringify(result, null, 4));
        });
    });
}

exports.IsWaiting = function(uid, callback) {
    console.log('Is wating UID : ', uid)
    Meow.find({ uid: uid }, function(err, result) {
        //console.log(JSON.stringify(result, null, 4));
        //console.log("UID: ",result[0].uid);
        console.log('plssssssssssssssssssssssss')
        if (result.length) {
            if (result[0].waiting == true) {
                console.log('waiting True! ', uid);
                callback(true, result[0].time_left);
            } else {
                console.log('waiting False (found)! ', uid);
                callback(false, null);
            }
        } else {
            console.log('waiting False! ', uid);
            callback(false, null);
        }
    });
}

exports.Waiting = function(uid, username, now) {
    //console.log(JSON.stringify(result, null, 4));
    console.log('Adding to waiting List : ', uid);
    Meow.find({ uid: uid }, function(err, result) {
        //console.log(JSON.stringify(result, null, 4));
        //console.log("UID: ",result[0].uid);
        Meow.update({ "uid": uid }, { "waiting": true, "time_left": now, "username": username }, { upsert: true }, function(err) {
            console.log('Update Waiting to True | save status:', err ? 'failed' : 'success');
        });
        //console.log(JSON.stringify(result, null, 4));
    });
}

exports.GetCollect = function(uid, callback) {
    console.log('Get Collect : ', uid);
    Meow.find({ uid: uid }, function(err, result) {
        console.log(JSON.stringify(result, null, 4));
        //console.log("UID: ",result[0].uid);
        if (result.length) {
            console.log('My Colleciton in GetCollect', result[0].collect)
            callback(result[0].collect);
        } else {
            callback(false);
        }
    });
}

function NewUser(id, cat) {
    var meow = new Meow({
        uid: id,
        collect: cat,
        waiting: false
    });
    meow.save(function(err) {
        console.log('New User | save status:', err ? 'failed' : 'success');
    });
}
