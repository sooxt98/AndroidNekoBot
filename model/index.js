var Mongoose = require('mongoose');
var Config = require('../config');

var uri = Config.MongoDb;

Mongoose.Promise = global.Promise;
Mongoose.connect(uri);

var MeowSchema = new Mongoose.Schema({
    uid: String,
    username: String,
    collect: Array,
    waiting: Boolean,
    time_left: Date
});

Mongoose.model('Meow',MeowSchema);
