var Discord = require('discord.js');
// var logger = require('winston');
var auth = require('./auth.json');
var channelsInfo = require('./channelsInfo.json');
// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", function (evt) {
    console.log('Connected');
    console.log(`Logged in as ${bot.user.username} - ${bot.user.id}!`);
});
// welcome
bot.on("guildMemberAdd", member => {
    console.log(`New Member Add as ${member.user.username} - ${member.user.id}`);
    member.guild.channels.cache.get(channelsInfo['世界頻']).send(`<@${member.user.id}> おはよう！請到 ${member.guild.channels.cache.get(channelsInfo['一般公告欄']).toString()} 查看釘選訊息來了解這個伺服唷^^/`);
});
// 訊息
bot.on("message", msg => {
    // 前置判斷
    try {
        // 判別需為群組訊息(非私訊)
        if (!msg.guild || !msg.member) return;
        // 判別是否為機器人訊息
        // if (!msg.member.user || msg.member.user.bot) return;
    }
    catch (err) {
        console.log(err);
        return;
    }

    //字串分析
    try {
        // 關鍵字回覆
        if (msg.content.toLowerCase().includes('yuuma')) {
            msg.channel.send('はい!!');
        }

        // 指令回覆
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) {
            const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串

            switch (cmd[0]) {
                case 'test':
                    msg.channel.send('loading...');
                    break;
                case 'rec':
                    let action = cmd[1];
                    let channelName = cmd[2];
                    let url = cmd[3];

                    if (action === 'start') {
                        if (!url) {
                            msg.reply('要給 頻道名稱 和 直播連結 唷 OAO');
                            return;
                        }
                        else if (!(url.startsWith('http://') || url.startsWith('https://'))) {
                            msg.reply('打咩！後面要接直播連結唷 OAO');
                            return;
                        }
                    }

                    console.log('===SetLiveChannel START===');
                    msg.reply(SetLiveChannel(msg, action, channelName));
                    console.log('===SetLiveChannel END===');

                    break;
                case 'myAvatar':
                    console.log('===GetMyAvatar START===');
                    const avatar = GetMyAvatar(msg);
                    console.log('===GetMyAvatar START===');
                    if (avatar.files) msg.channel.send(`${msg.author}`, avatar);
                    break;
                default:
                //msg.channel.send('OAOa？');
            }

        }
    }
    catch (err) {
        console.log(err);
        return;
    }


});

//獲取頭像
function GetMyAvatar(msg) {
    try {
        console.log(`GetMyAvatar: ${msg.author.username}`);
        return {
            files: [{
                attachment: msg.author.displayAvatarURL(),
                name: 'avatar.jpg'
            }]
        };
    } catch (err) {
        console.log(`GetMyAvatar Error: ${msg.author.username}`);
        return;
    }
}

// 回應LIVE(上播下播)，回傳replyMsg
// tip: 更改頻道名稱兩次後，需等候五分鐘才能再改
function SetLiveChannel(msg, action, channelName) {

    let prefix = '【rec】';

    console.log('Finding channel...');
    let channel = msg.guild.channels.cache.find(x => {
        if (x.name.length > 3) {
            let exitChannel = x.name.substring(3).toLowerCase();
            return channelName.toLowerCase().includes(exitChannel) || exitChannel.includes(channelName.toLowerCase());
        }
        return false;
    });

    if (channel) {
        console.log(`Found channel: ${channel.name}`);

        switch (action) {
            case 'start':
                channel.setName(`${prefix}${channel.name}`);
                console.log(`setName: ${prefix}${channel.name}`);
                msg.pin({ reason: 'live' });
                console.log(`pin message`);

                return ` 正在 ${channel.name} 進行直播！（已釘選）`;
            case 'end':
                const newName = channel.name.replace(`${prefix}`, '');
                channel.setName(newName);
                console.log(`setName: ${newName}`);
                msg.channel.messages
                .fetchPinned()
                .then(pinnedMsgs=>{
                    pinnedMsgs.find(x=>x.content.toLowerCase().includes(channelName.toLowerCase())).unpin();
                });
                console.log(`unpin message`);

                return ` ${newName} 結束直播！（已取消釘選）`;
        }

    }
    else {
        console.log('Not Found channel');
        return `${channelName} 在哪裡OAOa`;
    }
}