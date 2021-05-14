const Discord = require('discord.js');
// var logger = require('winston');
const auth = require('./auth.json');
// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", function (evt) {
    console.log('Connected');
    console.log(`Logged in as ${bot.user.username} - ${bot.user.id}!`);
});

bot.on("message", msg => {
    // 前置判斷
    try {
        // 判別需為群組訊息(非私訊)
        if (!msg.guild || !msg.member) return;
        // 判別是否為機器人訊息
        if (!msg.member.user || msg.member.user.bot) return;
    }
    catch (err) {
        console.log(err);
        return;
    }

    //字串分析
    try {
        // 關鍵字回覆
        if (msg.content.toLowerCase().includes('kamisama')) {
            msg.channel.send('ˊˇˋ?');
        }

        // 指令回覆
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) {
            const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串

            switch (cmd[0]) {
                case 'kamisama':
                    msg.reply('ˊˇˋ?');
                default:
                    //msg.channel.send('OAOa？');
            }

        }
    }
    catch (err) {
        console.log(err);
        return;
    }

})