var Discord = require('discord.js');
// var logger = require('winston');
var auth = require('./auth.json');
// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", function (evt) {
    console.log('Connected');
    console.log(`Logged in as ${bot.user.username} - ${bot.user.id}!`);
});
bot.on("message", msg => {
    // 前置判斷
    try{
        // 判別需為群組訊息(非私訊)
        if(!msg.guild || !msg.member) return;
        // 判別是否為機器人訊息
        if(!msg.member.user || msg.member.user.bot) return;
    }
    catch(err){
        console.log(err);
        return;
    }
    
    //字串分析
    try {
        // 關鍵字回覆
        if(msg.content.toLowerCase().includes('yuuma')){
            msg.channel.send('はい!!');
        }

        // 指令回覆
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) 
        {
            const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串
        
            switch(cmd[0]) {
                case 'test':
                    msg.channel.send('loading...');
                    break;
                case 'rec':
                    if(cmd[1] === 'start'){       
                        let url = cmd[2];
                        if(!url || !(url.startsWith('http://')|| url.startsWith('https://'))){
                            msg.reply('打咩！後面要接直播連結唷 OAO');
                        }
                        else{
                            console.log('Finding live channel...');
                            let channel = msg.guild.channels.cache.find(x=>x.name.includes("瘋狂實驗室"));
                            if(channel){
                                console.log(`Found channel: ${channel.name}`);
                                channel.setName("【rec】瘋狂實驗室");
                                msg.reply(' 正在進行直播！（REC已掛上，已訂選）');
                            }    
                            else{
                                console.log('Not Found channel');
                                msg.reply(' 正在進行直播！（REC未掛上）');
                            } 
                        }
                    }
                    else if (cmd[1] === 'end'){
                        msg.reply(' 結束直播！（已取消訂選）');
                            let channel = msg.guild.channels.cache.find(x=>x.name.includes("【rec】"));
                            channel.setName(channel.name.replace('【rec】',''));
                    }
                break;
                case 'myAvatar':
                    const avatar = GetMyAvatar(msg);
                    if (avatar.files) msg.channel.send(`${msg.author}`, avatar);
                    break;
                default:
                    msg.channel.send('OAOa？');
             }
    
            }
        }
    
    
    catch(err){
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