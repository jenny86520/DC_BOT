var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on("ready", function (evt) {
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function (user, userID, channelID, message, evt) {
    // 關鍵字回覆
    if(message.toLowerCase().includes('yuuma')){
        bot.sendMessage({
            to: channelID,
            message: 'はい!!'
        })
    }
    
    // 指令回覆
    const tag = message.substring(0, 1);
    let msg = '';
    if (tag == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        if(cmd){
    
        switch(cmd) {
            case 'test':
                msg = 'loading...';
                bot.sendMessage({
                    to: channelID,
                    message: msg,
                });
                break;
            case 'rec':
                let url = args[1];
                if(!url || !(url.startsWith('http://')|| url.startsWith('https://'))){
                    msg = '打咩！後面要接直播連結唷 OAO';
                }
                else{
                    msg = user + ' 正在進行直播！（已訂選）';
                    //message.guild.channels.find("name", "瘋狂實驗室").setName("[REC]瘋狂實驗室");
                }
                bot.sendMessage({
                    to: channelID,
                    message: msg,
                });
            break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'OAOa？'
                });
         }

        }
     }
});