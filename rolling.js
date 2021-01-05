const config = require("/home/mike/bottestingserver/config.json");

let roll_message_link = ""

exports.rollMessage = function(client, message, rollUsers) {
    if (message.content.substring(0,4).toLowerCase() === "roll" && message.attachments.first() != null && message.author.id != config.skipRoll){
        client.users.cache.forEach(function(value){
            rollUsers[value.id] = true
        })
        roll_message_link = "https://discordapp.com/channels/" + message.channel.guild.id + "/" + message.channel.id + "/" + message.id
        message.channel.send("Lets roll some numbers!")
    }
    if (!(message.author.id in rollUsers) && roll_message_link){
        rollUsers[message.author.id] = true
    }
    if (rollUsers[message.author.id] == true){
        message.channel.send(roll_message_link + "\n" + message.id)
        rollUsers[message.author.id] = false
    }
}