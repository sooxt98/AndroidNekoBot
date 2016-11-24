var Config = require('./config');

// Express Area =====================================
var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

var ipaddress = Config.ExpressUrl;
var port = Config.ExpressPort;
app.listen(port, ipaddress);



// Telegram Bot Area =====================================
var TelegramBot = require('node-telegram-bot-api');
var Moment = require('moment');
var Common = require('./common');
var Cat = require('./cat');
var Meow = require('./model/mongo/meow');

// Set Token
var token = Config.Token;

// Invoke Update
var bot = new TelegramBot(token, { polling: true });
block = [];

// Block User
bot.onText(/^\/block (.+)/, function(msg, match) {
    //check Owner
    if (!Common.IsOwner(msg)) {
        var chatId = msg.chat.id;
        bot.sendMessage(chatId, '你无权使用，污垢！', {
            reply_to_message_id: msg.message_id
        });
        return;
    }

    //block start
    var chatId = msg.chat.id;
    block.push(match[1].replace('@', ''));
    //var resp = "User :" + match[1] + " Already Blocked By you!"; // the captured "whatever"
    var resp = "Blocked User: " + match[1]; // the captured "whatever"

    bot.sendMessage(chatId, resp, {
        reply_to_message_id: msg.message_id
    });

});

bot.onText(/^\/blockls/, function(msg, match) {
    //check Owner
    if (!Common.IsOwner(msg)) {
        var chatId = msg.chat.id;
        bot.sendMessage(chatId, '你无权使用，污垢！', {
            reply_to_message_id: msg.message_id
        });
        return;
    }

    var chatId = msg.chat.id;
    var resp = "Blocked User: \n" + block.join(", "); // the captured "whatever"

    bot.sendMessage(chatId, resp, {
        reply_to_message_id: msg.message_id
    });

});

bot.onText(/^\/unblock (.+)/, function(msg, match) {
    //check Owner
    if (!Common.IsOwner(msg)) {
        var chatId = msg.chat.id;
        bot.sendMessage(chatId, '你无权使用，污垢！', {
            reply_to_message_id: msg.message_id
        });
        return;
    }

    if (match[1] != "all") {

        var target = match[1].replace('@', '');
        var chatId = msg.chat.id;
        var found = block.indexOf(target);

        while (found !== -1) {
            block.splice(found, 1);
            found = block.indexOf(target);
        }
        var chatId = msg.chat.id;
        var resp = "你解放了 : " + match[1];

        bot.sendMessage(chatId, resp, {
            reply_to_message_id: msg.message_id
        });
    } else {
        block = [];
        var chatId = msg.chat.id;
        var resp = "你们被解放了!";

        bot.sendMessage(chatId, resp, {
            reply_to_message_id: msg.message_id
        });
    }


});

bot.onText(/^\/meow (.+)/, function(msg, match) {

    //Check Block User
    if (Common.CheckBlock(msg)) {
        return;
    }

    var resp = match[1];
    console.log(match);
    var options = {
        reply_to_message_id: msg.message_id,
        force_reply: true,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: '戳我', callback_data: 'add' }
                ]
            ]
        }),
        reply_to_message_id: msg.message_id
    };
    var chatId = msg.chat.id;

    bot.sendMessage(chatId, resp, options).then(function(sended) {
        bot.on('callback_query', function(msg) {
            if (msg.data == 'add') {
                if (msg.message.text.indexOf(msg.from.username) > -1) {
                    bot.answerCallbackQuery(msg.id, '你戳过了！');
                } else {
                    NewList = msg.message.text + "\n" + msg.from.username;
                    OldList = msg.message.text;
                    if (OldList != NewList) {
                        bot.editMessageText(NewList, {
                            chat_id: msg.message.chat.id,
                            message_id: msg.message.message_id,
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [
                                        { text: '戳我', callback_data: 'add' }
                                    ]
                                ]
                            })
                        });
                    }
                }
            }
        });
    });

});



bot.onText(/^\/rubbish/, function(msg, match) {

    var chatId = msg.chat.id;
    var options = {
        force_reply: true,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: '来乱的', callback_data: '<' },
                    { text: '按爽的', callback_data: '+' },
                    { text: '装饰用的', callback_data: '>' }
                ]
            ]
        }),
        reply_to_message_id: msg.message_id
    };

    var resp = match[1]; 

    bot.sendMessage(chatId, '测试Inline Keyboard？<a href="telegram.me/' + msg.from.username + '">' + msg.from.username + '</a>', options);
});

bot.on('callback_query', function(msg) {
    console.log(msg);
    var chatId = msg.message.chat.id;
    var FromID = msg.from.id;
    if (msg.data == '<') {
        bot.answerCallbackQuery(msg.id, '你真的来乱的，无言。。。')

        bot.sendMessage(FromID, '你真的来乱的，无言。。。');
    }
    if (msg.data == '+') {
        bot.answerCallbackQuery(msg.id, '别按了，浪费力气')

        bot.sendMessage(FromID, '别按了，浪费力气');
    }
    if (msg.data == '>') {
        bot.answerCallbackQuery(msg.id, '不知道，退群呗！')

        bot.sendMessage(FromID, '不知道，我不敢了！');
    }

});

const selections = [
    { name: '靠北', code: '你真的废话耶' },
    { name: '靠腰', code: '你真的倒霉耶' }
]



bot.on('inline_query', function(msg) {
    console.log(msg);
    const query = msg.query || ''
    console.log(query);

    if (query.lastIndexOf('cmd', 0) === 0) {
        var cmd = query.slice(4);
        console.log('Query:', query, 'Cmd:', cmd);
        const results = selections
            .filter((selection) => selection.name.indexOf(cmd) !== -1)
            .map((selection) => {
                return {
                    id: selection.code,
                    title: selection.name,
                    type: 'article',
                    input_message_content: {
                        message_text: `${selection.name} : *${selection.code}*`,
                        parse_mode: 'Markdown'
                    }
                }
            })
        bot.answerInlineQuery(msg.id, results)

    }

    if (query.lastIndexOf('food', 0) === 0) {
        var cmd = query.slice(5);
        console.log('Query:', query, 'Cmd:', cmd);
        const results = foods
            .map((food) => {
                return {
                    id: food,
                    type: 'sticker',
                    sticker_file_id: food,
                    /*
                                input_message_content: {
                                  message_text: `${food(food)}`,
                                  parse_mode: 'Markdown'
                                }
                    */
                }
            })
        bot.answerInlineQuery(msg.id, results)

    } else {
        Meow.GetCollect(msg.from.id, function(cats) {
            if (cats) {
                console.log("My Collection Inline: ", cats)
                const results = cats
                    .map((cat) => {
                        return {
                            id: cat,
                            type: 'sticker',
                            sticker_file_id: cat,
                        }
                    })
                bot.answerInlineQuery(msg.id, results, { cache_time: 0 })
            }
        });

    }

});



var foods = [
    'BQADBQADvAADzRHFCfiIn1y8tqJtAg',
    'BQADBQADuAADzRHFCfjJ35sjgYX1Ag',
    'BQADBQADtgADzRHFCTZwswPhSTCfAg',
    'BQADBQADugADzRHFCSCNuodnWz2iAg'
]

function food(id) {
    if (id == 'BQADBQADvAADzRHFCfiIn1y8tqJtAg')
        return 'Bits'
    if (id == 'BQADBQADuAADzRHFCfjJ35sjgYX1Ag')
        return 'Fish'
    if (id == 'BQADBQADugADzRHFCSCNuodnWz2iAg')
        return 'Treat'
    if (id == 'BQADBQADtgADzRHFCTZwswPhSTCfAg')
        return 'Chicken'
}


/*
bot.onText(/\/spam/, function(msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    for (var i = 0; i < 100; i++) {
        var chatId = msg.chat.id;
        bot.sendMessage(chatId, '测试洗板？');
    }

    // send back the matched "whatever" to the chat

});
*/

// Function For Meow~!
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function waitFish(time, cat, callback) {
    time = time * 1000 * 60 * 60;
    setTimeout(function() {
        callback(cat);
    }, time);
}

bot.on('message', function(msg) {
    console.log(msg);
    //var chatId = msg.chat.id;
    if (msg.sticker) {
        if (foods.indexOf(msg.sticker.file_id) > -1) {
            var chatId = msg.chat.id;
            var UserId = msg.from.id;
            var UserName = msg.from.username;
            Meow.IsWaiting(UserId, function(result, time_left) {
                console.log('GGGGGGGGGGGGGGGGGGGGGGG', result)
                var IsWaiting = result;
                console.log('Waiting Stat: ', IsWaiting)
                if (IsWaiting == true) {
                    var now = Moment(new Date()).add(13, 'hours').format();
                    var TimeLeft = Moment(time_left).diff(now);
                    bot.sendMessage(chatId, "您已请求过！还剩" + Moment.duration(TimeLeft).hours() + "小时" + Moment.duration(TimeLeft).minutes() + "分钟" + Moment.duration(TimeLeft).seconds() + "秒", {
                        reply_to_message_id: msg.message_id
                    });
                    return;
                }

                var time;

                switch(food(msg.sticker.file_id)){
                    case 'Bits':
                        time = randomInt(0.5, 5); break
                    case 'Fish':
                        time = randomInt(1, 12); break
                    case 'Chicken':
                        time = randomInt(2, 24); break
                    case 'Treat':
                        time = randomInt(3, 48); break
                }

                //time = randomInt(2, 12);
                //time = 0.1;
                catSticker = Cat[randomInt(0, 113)];
                console.log("***" + catSticker);
                bot.sendMessage(chatId, "请静坐" + time + "小时,等待小猫~", {
                    reply_to_message_id: msg.message_id
                });
                var now = Moment(new Date()).add(13 + time, 'hours').format();
                Meow.Waiting(UserId, UserName , now);
                waitFish(time, catSticker, function(catSticker) {
                    bot.sendSticker(chatId, catSticker, { reply_to_message_id: msg.message_id });
                    bot.sendMessage(chatId, "主人谢谢您的鱼,喵~", {
                        reply_to_message_id: msg.message_id
                    });
                    Meow.Save(UserId, catSticker);
                });
            });

        }
    }
});
