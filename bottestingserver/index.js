// Load up the discord.js library
const Discord = require("discord.js");
const fs = require("fs")

const path = "/home/pi/urdumbot/"
//const path = "./"
const botID = "704483818530144776"

const botResponse = require("/home/pi/urdumbot/response.js");
const botManage = require("/home/pi/urdumbot/manage.js");
const botManageRules = require("/home/pi/urdumbot/manageRules.js");
const botAddNewRule = require("/home/pi/urdumbot/addnewrule.js");


/********************************************** start code **********************************************/

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Update successful!`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Rocket League`);
});

client.on("message", async message => {
// This event will run on every single message received, from any channel or DM.
  
    if(message.author.bot) return;

    if(fs.existsSync(path + message.author.id + "user.json") && message.content.indexOf(config.command) !== 0){
        let addjson = JSON.parse(fs.readFileSync(path + message.author.id + "user.json"))
        if (Date.now()-addjson["timestamp"] > config.timeout*1000){
            fs.unlinkSync(path + message.author.id + "user.json")
        }
        else if (message.content === "quit" || message.content === "q"){
            message.channel.send("Quit Adding Command")
            fs.unlinkSync(path + message.author.id + "user.json")
            return
        }
        else {
            if (addjson["channel"] == message.channel.id){
                botAddNewRule.addNewRule(client, message)
                return
            }
        }
    }

    if (message.content.indexOf(config.prefix) === 0){
        // Here we separate our "command" name, and our "arguments" for the command. 
        // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
        // command = say
        // args = ["Is", "this", "the", "real", "life?"]
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
        
        botManage.execManage(client, message, args, command);
    }
    else if (message.content.indexOf(config.command) === 0){
        botManageRules.manageRules(client, message)
    }
    else {
        botResponse.botMessage(client, message)
    }

});

client.on("voiceStateUpdate", (oldState, newState) => {
    // This event triggers when a user enters or leave the voice channel.

    if (oldState.member.id === botID) return;

    botResponse.botVoice(client, oldState, newState);  
  
});

client.login(config.token);
