const config = require("/home/mike/bottestingserver/config.json");

const fs = require("fs")

exports.manageRules = function(client, message) {
    //console.log(message.content);

    if (message.content.length == 2 && message.content.charAt(1) === '?'){
        message.reply( "|\nBot Management\n\n\
                        $list         ->    list rules                       ('$list' or '$list rulename 1, rulename 2, ...')\n\
                        $add        ->    add rule                       (follow prompt)\n\
                        $delete   ->    delete rule                   ('delete rulename 1')\n\
                        $audio    ->    list local audio files    ('$audio' to list or '$audio audiofile 1' to play file")
    }
    else if (message.content.substring(0,5) === "$list"){
        if(message.content.length == 5){
            fs.readFile(config.path + "rules.json", (err, rulesData) => {
                if (err) throw err
                let returnRuleList = ""
                let rules = JSON.parse(rulesData.toString())
                for (let x in rules){
                    returnRuleList += "\n" + x
                }
                message.reply("|\nRule List:\n" + returnRuleList)
            })
        }
        else if (message.content.charAt(5) === " "){
            let ruleList = message.content.slice(5).trim().split(/,+/g)
            fs.readFile(config.path + "rules.json", (err, rulesData) => {
                if (err) throw err
                let returnRuleList = ""
                let rules = JSON.parse(rulesData.toString())
                for (let x of ruleList){
                    if (x.trim() in rules){
                        returnRuleList += "Parameters for " + x.trim()
                        returnRuleList += JSON.stringify(rules[x.trim()]).replace(/{/gi, "\n").replace(/}/gi, "\n").replace(/,/gi, "\n") + "\n"
                    }
                }
                if (returnRuleList){
                    message.reply("|\nRule List:\n\n" + returnRuleList)
                }
                else{
                    message.reply("No Rules Found!")
                }
            })
        }
    }
    else if (message.content === "$add"){
        let addRuleJSON = {}
        addRuleJSON["name"] = message.author.id
        addRuleJSON["channel"] = message.channel.id
        addRuleJSON["timestamp"] = Date.now()

        fs.writeFile(config.path + message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })

        message.reply("What is the name of the new rule? (type \"quit\" to stop)")
    }
    else if (message.content.substring(0,7) === "$delete"){
        if (message.content.charAt(7) === " "){
            let returnRuleList = ""
            let ruleList = message.content.slice(7).trim().split(/,+/g)
            fs.readFile(config.path + "rules.json", (err, rulesData) => {
                if (err) throw err
                let rules = JSON.parse(rulesData.toString())

                for (let x of ruleList){
                    if (x.trim() in rules){
                        delete rules[x.trim()]
                        returnRuleList += x.trim() + "\n"
                    }
                }
                if (returnRuleList){
                    message.reply("|\nRules Deleted:\n\n" + returnRuleList)
                }
                else{
                    message.reply("No Rules Found!")
                }
                fs.writeFile(config.path + "rules.json", JSON.stringify(rules), (err) => {
                    if (err) throw err;
                })
            })
        }
    }
    else if (message.content.substring(0,6) === "$audio"){
        if(message.content.length == 6){
            fs.readdir(config.path + "audio/", function(err, items) {
                let audioList = "|\nLocal Audio Files\n\n"
                for (let x of items){
                    audioList += x + "\n"
                }
                message.reply(audioList)
            })
        }
        else if (message.content.charAt(6) === " "){
            let ruleList = message.content.slice(6).trim().split(/,+/g)
            if (fs.existsSync(config.path + "audio/" + ruleList[0])){
                client.channels.fetch(config.defaultVoice)
                .then(channel => {
                    channel.join()
                        .then(connection => {
                            const dispatcher = connection.play(config.path + "audio/" + ruleList[0])
                            dispatcher.on('finish', () => {channel.leave()})
                        })
                })

            }
        }
    }
    else if (message.content.substring(0,5) === "$echo"){
        let echoConfig = {}
        echoConfig["name"] = message.author.id
        echoConfig["channel"] = config.defaultText
        echoConfig["timestamp"] = Date.now()
        if (message.content.charAt(5) === " "){
            try{
                echoConfig["channel"] = client.channels.cache.find(channel => channel.name === message.content.substring(6)).id
            }
            catch (error){
                message.reply("No channel")
                return
            }
        }
        fs.writeFile(config.path + message.author.id + "echo.json", JSON.stringify(echoConfig), (err) => {
            if (err) throw err;
        })
        message.reply("Ready")
    }
    else{
        message.reply("Not a command. If you are trying to add a command, drop the '$' when setting options")
    }
}