// Load up the discord.js library
const Discord = require("discord.js");

var fs = require('fs');
var dev = "700028814402650262";
var tdsID = "131087537165959168";

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Update successful!");
  //const guild = client.guilds.cache.find(guild => guild.id == 701795436767215686);
  //console.log(guild.emojis)

  //channel.send("").then(() => client.destroy());
  //channel.send("", {files: [""]}).then(() => client.destroy());
});

client.on("message", async (message) => {

    if(message.author.bot) return;

    let test = "<alsofish:83290705698234>"

    console.log(test.replace(/[^A-Za-z]/gi, ""))
    return

    if (message.content.length == 1){
      message.react(message.content)
    }
    else{
      message.react(client.emojis.cache.find(emoji => emoji.id === (message.content.split(":")[2].slice(0,-1))))
    }
    //catch(error){
    //  console.log(message.content)
    //  //message.react(client.emojis.cache.resolve(message.content))
    //}
    return


    const embed = new Discord.MessageEmbed()
        .setTitle('A slick little embed')
        .setColor(0xff0000)
        .setDescription('Hello, this is a slick embed!')
    message.channel.send(embed);
});


client.login("NzAxNzk1NTM0MTAwMjM0MzQw.XrCC8Q.5pRWgaiClWKrx5dalNf5qf9kJvQ");  //bot testing server
//client.login("Njk5ODEzODkxOTgyNjIyNzIw.Xp9hSA.Fukw0RIQZT63BAG8m3fMuNeqvZY");  //Donaldinho
