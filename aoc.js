const config = require("/home/mike/bottestingserver/config.json");

const fs = require("fs");
const Discord = require("discord.js");
const { exit } = require("process");


exports.adventofcode = function(client) {

    var oldstats = fs.statSync(config.path + "aoc_old.json");
    var newstats = fs.statSync(config.path + "aoc_new.json");

    var oldaoc = JSON.parse(fs.readFileSync(config.path + "aoc_old.json"))["members"];
    var newaoc = JSON.parse(fs.readFileSync(config.path + "aoc_new.json"))["members"];

    var oldkeys = Object.keys(oldaoc);

    for (let user of oldkeys){
        var oldstars = oldaoc[user]["completion_day_level"];
        var newstars = newaoc[user]["completion_day_level"];
        var newstarskeys = Object.keys(newstars);
        for (let challenge of newstarskeys){
            if (!(challenge in oldstars)){
                const embed = new Discord.MessageEmbed()
                    .setTitle("Congratulations " + oldaoc[user]["name"] + "!")
                    .setColor(0xc0c0c0)
                    .setDescription("On getting the silver star for day " + challenge + "!")

                client.channels.fetch(config.aocChannel)
                .then(channel => {
                    channel.send(embed)
                }).catch(console.error)

                var newday = newstars[challenge]
                if ("2" in newday){
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Congratulations " + oldaoc[user]["name"] + "!")
                        .setColor(0xffd700)
                        .setDescription("On getting the gold star for day " + challenge + "!")

                    client.channels.fetch(config.aocChannel)
                    .then(channel => {
                        channel.send(embed)
                    }).catch(console.error)
                }
            }
            else{
                var oldday = oldstars[challenge]
                var newday = newstars[challenge]
                
                if ("2" in newday && !("2" in oldday)){

                    const embed = new Discord.MessageEmbed()
                        .setTitle("Congratulations " + oldaoc[user]["name"] + "!")
                        .setColor(0xffd700)
                        .setDescription("On getting the gold star for day " + challenge + "!")

                    client.channels.fetch(config.aocChannel)
                    .then(channel => {
                        channel.send(embed)
                    }).catch(console.error)
                }
            }
        }
    }

    fs.copyFile(config["path"] + "aoc_new.json", config["path"] + "aoc_old.json", (err) => {
        if (err) throw err;
    });

}