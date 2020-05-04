const fs = require("fs")

//const rulesPath = "./rules.json"
const rulesPath = "/home/pi/urdumbot/rules.json"

const defaultText = "585642950361612300"        //urdum general
const defautVoice = "585642950361612302"        //urdum

exports.botMessage = function(client, message) {
    fs.readFile(rulesPath, (err, data) => {
        if (err) throw err
        var rules = JSON.parse(data)
        var sendRules = checkMessageConditions(message, rules)
        react(client, sendRules, rules, message)
    })
}

exports.botVoice = function(client, oldState, newState) {
    fs.readFile(rulesPath, (err, data) => {
        if (err) throw err
        var rules = JSON.parse(data)
        var sendRules = checkVoiceConditions(oldState, newState, rules)
        react(client, sendRules, rules)
    })
}


function checkMessageConditions(message, rules){
    var passedTests = true
    var sendRules = []

    for (var i = 0; i < Object.keys(rules).length; i++){
        var ruleName = Object.keys(rules)[i]
        var layer1 = rules[ruleName]["conditions"]
        let count = 0
        for (var j = 0; j < Object.keys(layer1).length; j++){
            var indexName = Object.keys(layer1)[j]
            if (indexName === "message user"){
                if (layer1["message user"][0]){
                    count++
                    passedTests = false
                    for (let x of layer1["message user"]){
                        if (x === message.author.id){
                            break
                        }
                    }
                }
                continue
            }
            if (indexName === "message contents"){
                if (layer1["message contents"][0]){
                    count++
                    passedTests = false
                    for (let x of layer1["message contents"]){
                        if (message.content.includes(x)){
                            passedTests = true
                            break
                        }
                    }
                }
                continue
            }
            if (indexName === "message user role"){
                if (layer1["message user role"][0]){
                    count++
                    passedTests = false
                    for (let x of layer1["message user role"]){
                        if (message.member.roles.cache.has(x)){
                            passedTests = true
                            break
                        }
                    }
                }
                continue
            }
            if (indexName === "message channel"){
                if (layer1["message channel"][0]){
                    count++
                    passedTests = false
                    for (let x of layer1["message channel"]){
                        if (x === message.channel.id){
                            passedTests = true
                            break
                        }
                    }
                }
                continue
            }
            if (indexName === "message file"){
                count++
                if ((layer1["message file"] == true)  && (message.attachments.first() == null)){
                    passedTests = false
                    break
                }
                continue
            }
        }
        if (passedTests && count) sendRules.push(ruleName)
        passedTests = true
    }
    return sendRules
}

function checkVoiceConditions(oldState, newState, rules){
    var passedTests = false
    var sendRules = []

    for (var i = 0; i < Object.keys(rules).length; i++){
        var ruleName = Object.keys(rules)[i]
        var layer1 = rules[ruleName]["conditions"]
        for (var j = 0; j < Object.keys(layer1).length; j++){
            var indexName = Object.keys(layer1)[j]
            if (indexName === "voice user login"){
                if (layer1["voice user login"][0] && oldState.channelID == undefined && !(newState.channelID == undefined)){
                    for (let x of layer1["voice user login"]){
                        if (x === oldState.member.id){
                            passedTests = true
                            break
                        }
                    }
                    break
                }
            }
            if (indexName === "voice user logout"){
                if (layer1["voice user logout"][0] && newState.channelID == undefined){
                    for (let x of layer1["voice user logout"]){
                        if (x === oldState.member.id){
                            passedTests = true
                            break
                        }
                    }
                    break
                }
            }
        }
        if (passedTests) sendRules.push(ruleName)
        passedTests = false
    }
    return sendRules
}

function react(client, sendRules, rules, message) {
    var sendContent = {}
    var voiceChannel = defaultVoice
    var newTextChannel = defaultText

    for (var i = 0; i < sendRules.length; i++){
        var sendMethod = "send"
        var deleteMethod = "none"
        var playSound = true
        var name = sendRules[i]
        var layer1 = rules[name]["response"]
        for (var j = 0; j < Object.keys(layer1).length; j++){
            var indexName = Object.keys(layer1)[j]
            if (indexName === "message contents"){
                if (layer1["message contents"]){
                    sendContent["content"] = layer1["message contents"]
                }
            }
            if (indexName === "message attachment"){
                if (layer1["message attachment"]){
                    sendContent["files"] = layer1["message attachment"]
                }
            }
            if (indexName === "message channel"){
                if (layer1["message channel"]){
                    newTextChannel = layer1["message channel"]
                }
            }
            if (indexName === "message react emoji"){
                if (layer1["message react emoji"]){
                    for (let x of layer1["message react emoji"]){
                        message.react(x)
                    }
                }
            }
            if (indexName === "message reply"){
                if (layer1["message reply"] == true){
                    sendMethod = "reply"
                }
            }
            if (indexName === "message delete"){
                if (layer1["message delete"] == true){
                    deleteMethod = "delete"
                }
            }
            if (!(layer1["message contents"]) && !(layer1["message attachment"][0])){
                sendMethod = ""
            }
            if (indexName === "voice play audio"){
                if (layer1["voice play audio"]){
                    voiceMethod = "voiceDefault"
                }
            }
            if (indexName === "voice channel"){
                if (layer1["voice channel"]){
                    voiceChannel = layer1["voice channel"]
                }
            }
        }
        if (sendMethod === "reply"){
            message.reply(sendContent)
        }
        else if (sendMethod === "send"){
            try{
                textChannel = message.channel
                textChannel.send(sendContent)
            }
            catch(error)
            {
                client.channels.fetch(newTextChannel)
                    .then(channel => {
                        channel.send(sendContent)
                    }).catch(console.error)
            }
        }
        if (deleteMethod === "delete"){
            message.delete()
        }
        if (playSound){
            client.channels.fetch(voiceChannel)
            .then(channel => {
                channel.join()
                    .then(connection => {
                        const dispatcher = connection.play(layer1["voice play audio"])
                        dispatcher.on('finish', () => {channel.leave()})
                    })
            })
        }
    }
}
