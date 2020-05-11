const config = require("/home/mike/bottestingserver/config.json");

const fs = require("fs")

exports.botMessage = function(client, message) {
    fs.readFile(config.path + "rules.json", (err, data) => {
        if (err) throw err
        let rules = JSON.parse(data)
        let sendRules = checkMessageConditions(message, rules)
        react(client, sendRules, rules, 0x0, message)
    })
}

exports.botVoice = function(client, oldState, newState) {
    fs.readFile(config.path + "rules.json", (err, data) => {
        if (err) throw err
        let rules = JSON.parse(data)
        let sendRules = checkVoiceConditions(oldState, newState, rules)
        react(client, sendRules, rules, 0x80000000)
    })
}

function checkMessageConditions(message, rules){
    let passedTests = true
    let sendRules = []

    for (let i = 0; i < Object.keys(rules).length; i++){
        let ruleName = Object.keys(rules)[i]
        let layer1 = rules[ruleName]["conditions"]
        let count = 0
        for (let j = 0; j < Object.keys(layer1).length; j++){
            let indexName = Object.keys(layer1)[j]
            if (indexName === "message user"){
                if (layer1["message user"][0]){
                    count++
                    passedTests = false
                    for (let x of layer1["message user"]){
                        if (x === message.author.id){
                            passedTests = true
                            break
                        }
                    }
                    if (!passedTests) break
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
                    if (!passedTests) break
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
                    if (!passedTests) break
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
                    if (!passedTests) break
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
    let passedTests = false
    let sendRules = []

    for (let i = 0; i < Object.keys(rules).length; i++){
        let ruleName = Object.keys(rules)[i]
        let layer1 = rules[ruleName]["conditions"]
        for (let j = 0; j < Object.keys(layer1).length; j++){
            let indexName = Object.keys(layer1)[j]
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

function react(client, sendRules, rules, flags, message) {
    let sendContent = {}
    let voiceChannel = config.defaultVoice
    let newTextChannel = config.defaultText

    for (let i = 0; i < sendRules.length; i++){
        let layer1 = rules[sendRules[i]]["response"]
        for (let j = 0; j < Object.keys(layer1).length; j++){
            let indexName = Object.keys(layer1)[j]
            if (indexName === "message contents"){
                if (layer1["message contents"]){
                    sendContent["content"] = layer1["message contents"]
                    flags |= 0x1
                }
                continue
            }
            if (indexName === "message attachment"){
                if (layer1["message attachment"][0]){
                    sendContent["files"] = layer1["message attachment"]         // this will move all attachments to sendContent
                    flags |= 0x2
                }
                continue
            }
            if (indexName === "message channel"){
                if (layer1["message channel"]){
                    newTextChannel = layer1["message channel"]
                    flags |= 0x4
                }
                continue
            }
            if (indexName === "message react emoji"){
                if (layer1["message react emoji"]){
                    for (let x of layer1["message react emoji"]){
                        if (x.length == 1){
                            message.react(x)
                        }
                        else if (x.substring(0,2) === "<:"){
                            message.react(client.emojis.cache.find(emoji => emoji.id === (x.split(":")[2].slice(0,-1))))
                        }
                    }
                    flags |= 0x8
                }
                continue
            }
            if (indexName === "message reply"){
                if (layer1["message reply"] == true){
                    flags |= 0x10
                }
                continue
            }
            if (indexName === "message delete"){
                if (layer1["message delete"] == true){
                    flags |= 0x20
                }
                continue
            }
            if (indexName === "voice play audio"){
                if (layer1["voice play audio"]){
                    flags |= 0x40
                }
            }
            if (indexName === "voice channel"){
                if (layer1["voice channel"]){
                    voiceChannel = layer1["voice channel"]
                    flags |= 0x80
                }
            }
        }
        if (flags & 0x3){
            if (flags & 0x10){
                message.reply(sendContent)
            }
            else if ((flags & 0x80000000) || (flags & 0x4)){
                client.channels.fetch(newTextChannel)
                    .then(channel => {
                        channel.send(sendContent)
                    }).catch(console.error)
            }
            else{
                message.channel.send(sendContent)
            }
        }
        if (flags & 0x20){
            message.delete()
        }
        if (flags & 0x40){
            client.channels.fetch(voiceChannel)
            .then(channel => {
                channel.join()
                    .then(connection => {
                        const dispatcher = connection.play(config.path + "audio/" + layer1["voice play audio"])
                        dispatcher.on('finish', () => {channel.leave(); return})
                    })
            })
        }
    }
}
