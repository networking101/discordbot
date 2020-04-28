const fs = require("fs")
const rulesPath = "./rules.json"

const message_or_voice = "Does this rule trigger on a message event (type \"[m]essage\") or voice event(type \"[v]oice\")?"

const message_trigger_which_user = "Who does this rule trigger on (\"[n]one\" to trigger on everyone)?"
const message_trigger_other_user = "Who else does this rule trigger on (\"[n]one\" to finish)?"
const message_trigger_which_keyword = "What keywords does this rule trigger on (\"[n]one\" to trigger on any keywords)?"
const message_trigger_other_keyword = "What other keywords does this rule trigger on (\"[n]one\" to finish)?"
const message_trigger_which_role = "What user roles does this rule trigger on(\"[n]one\" to trigger on every role)?"
const message_trigger_other_role = "What other roles does this rule trigger on (\"[n]one\" to finish)?"
const message_trigger_which_channel = "What channel does this rule trigger on (\"[n]one\" to trigger on every channel)?"
const message_trigger_other_channel = "What other channels does this rule trigger on(\"[n]one\" to trigger on every channel)?"
const message_trigger_is_file = "Does there need to be a file to trigger (\"[y]es\" or \"[n]o\")?"

const voice_trigger_who_login = "Which user logging onto voice chat does this rule trigger on (\"[n]one\" for no one)?"
const voice_trigger_other_login = "Who else does this rule trigger on (\"[n]one\" for no one)?"
const voice_trigger_who_logout = "Which user logging out of voice chat does this rule trigger on (\"[n]one\" for no one)?"
const voice_trigger_other_logout = "Who else does this rule trigger on (\"[n]one\" for no one)?"

const response_which_text = "If this rule sends a message, what text is sent (\"[n]one\" to skip)?"
const response_which_attachment = "|\nIf this rule sends a message, what attachment is sent (\"[n]one\" to skip)?"
const response_which_attachment_rules = "\nAttachments must be a valid url link to the image"
const response_other_attachment = "Any other attachments (\"[n]one\" to skip)?"
const response_which_channel = "If this rule sends a message to a specific channel, which channel (\"[n]one\" to send to default channel)?"
const response_which_emoji = "If this rule reacts with an emoji, which one (\"[n]one\" to skip)?"
const response_other_emoji = "Any other emojis (\"[n]one\" to skip)?"
const response_is_reply = "Is this response message a reply (\"[y]es\" or \"[n]o\")?"
const response_is_delete = "Should the trigger message be deleted (\"[y]es\" or \"[n]o\")?"
const response_which_voice_file = "If this rule plays a sound, what file should it play (\"[n]one\" to skip)?"
const response_which_voice_rules = "\nAttachments must be a valid url link to the image or be a valid mp3 file in /home/pi/discordbotrun/audio/"
const response_which_voice_channel = "If this rule plays a sound, which channel (\"[n]one\" to send to default channel)?"

const done_setting_conditions = "|\nDone setting conditions! Now on to the response\n"
const ask_to_add_rule = "|\nWould you like to add this rule (\"[y]es\" or \"[n]o\")?\n\n"
const rule_added = "!!Rule added!!"
const rule_not_added = "Rule not added"

const does_not_compute = "Does not Compute. Try again."
const type_quit_to_stop = " (type \"[q]uit\" to stop)"
const invalid_try_again = "Invalid input. Try again. "
const bad_format = "Not in the proper format or bad file. Try again. "

exports.addNewRule = function(client, message) {
    fs.readFile("./" + message.author.id + "user.json", (err, data) => {
        if (err) throw err
        let addRuleJSON = JSON.parse(data.toString())
        addRuleJSON["timestamp"] = Date.now()

        if (Object.keys(addRuleJSON).length > 3){
            if(addRuleJSON["event"]){
                if (addRuleJSON["flags"] & 0x80000000){
                    addCondition(client, message)
                }
                else{
                    if (addRuleJSON["event"] === "message"){
                        addMessage(client, message)
                    }
                    else if (addRuleJSON["event"] === "voice") {
                        addVoice(client, message)
                    }
                }
            }
            else{
                if (message.content.toLowerCase() === "voice" || message.content.toLowerCase() === "v"){
                    addRuleJSON["event"] = "voice"
                    addRuleJSON[Object.keys(addRuleJSON)[5]] = {
                                                        "conditions": {
                                                            "voice user login": [], 
                                                            "voice user logout": []
                                                        },
                                                        "response": {
                                                            "message contents": "",
                                                            "message attachment": [],
                                                            "message channel": "",
                                                            "voice play audio": "",
                                                            "voice channel": ""
                                                        }
                                                    }
                    message.reply(voice_trigger_who_login + type_quit_to_stop)
                }
                else if (message.content.toLowerCase() === "message" || message.content.toLowerCase() === "m"){
                    addRuleJSON["event"] = "message"
                    addRuleJSON[Object.keys(addRuleJSON)[5]] = {
                                                        "conditions": {
                                                            "message user": [], 
                                                            "message contents": [],
                                                            "message user role": [],
                                                            "message channel": [],
                                                            "message file": false
                                                        },
                                                        "response": {
                                                            "message contents": "",
                                                            "message attachment": [],
                                                            "message channel": "",
                                                            "message react emoji": [],
                                                            "message reply": false,
                                                            "message delete": false,
                                                            "voice play audio": "",
                                                            "voice channel": ""
                                                        }
                                                    }
                    message.reply(message_trigger_which_user + type_quit_to_stop)
                }
                else{
                    message.reply(does_not_compute + type_quit_to_stop)
                }
            }
            
        }
        else{           // No rule, ask for user
            addRuleJSON["flags"] = 0
            addRuleJSON["event"] = ""
            addRuleJSON[message.content] = {}
            message.reply(message_or_voice + type_quit_to_stop)
        }
        fs.writeFile(message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })
    })
}

function addMessage(client, message) {
    fs.readFile("./" + message.author.id + "user.json", (err, data) => {
        if (err) throw err
        let addRuleJSON = JSON.parse(data.toString())
        let completeFlag = addRuleJSON["flags"]
        let currentKey = addRuleJSON[Object.keys(addRuleJSON)[5]]
        if(completeFlag & 0x1){
            if(completeFlag & 0x2){
                if(completeFlag & 0x4){
                    if(completeFlag & 0x8){
                        if(!(completeFlag & 0x10)){
                            if(message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "y"){
                                currentKey["conditions"]["message file"] = true
                                addRuleJSON["flags"] = 0x80000000
                                message.reply(done_setting_conditions + response_which_text + type_quit_to_stop)
                            }
                            else if(message.content.toLowerCase() === "no" || message.content.toLowerCase() === "n"){
                                currentKey["conditions"]["message file"] = false
                                addRuleJSON["flags"] = 0x80000000
                                message.reply(done_setting_conditions + response_which_text + type_quit_to_stop)
                            }
                            else{
                                message.reply(invalid_try_again + message_trigger_is_file)
                            }
                        }
                    }
                    else{
                        let curUserVal = currentKey["conditions"]["message channel"]
                        if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                            addRuleJSON["flags"] = completeFlag | 0x8
                            //message.reply(message_trigger_is_file + type_quit_to_stop)
                            interactResponse(message, addRuleJSON["flags"], "message")
                        }
                        else{
                            try{
                                curUserVal.push(client.channels.cache.find(channel => channel.name === message.content).id)
                                message.reply(message_trigger_other_channel + type_quit_to_stop)
                            }
                            catch (error){
                                message.reply(invalid_try_again + message_trigger_other_channel + type_quit_to_stop)
                            }
                        }
                    }
                }
                else{
                    let curUserVal = currentKey["conditions"]["message user role"]
                    if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                        addRuleJSON["flags"] = completeFlag | 0x4
                        //message.reply(message_trigger_which_channel + type_quit_to_stop)
                        interactResponse(message, addRuleJSON["flags"], "message")
                    }
                    else{
                        try{
                            curUserVal.push(message.member.roles.cache.find(role => role.name === message.content).id)
                            message.reply(message_trigger_other_role + type_quit_to_stop)
                        }
                        catch (error){
                            message.reply(invalid_try_again + message_trigger_other_role + type_quit_to_stop)
                        }
                    }
                }
            }
            else{
                let curUserVal = currentKey["conditions"]["message contents"]
                if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                    addRuleJSON["flags"] = completeFlag | 0x2
                    //message.reply(message_trigger_which_role + type_quit_to_stop)
                    interactResponse(message, addRuleJSON["flags"], "message")
                }
                else{
                    curUserVal.push(message.content)
                    message.reply(message_trigger_other_keyword + type_quit_to_stop)
                }
            }
        }
        else{
            let curUserVal = currentKey["conditions"]["message user"]
            if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                addRuleJSON["flags"] = completeFlag | 0x1
                //message.reply(message_trigger_which_keyword + type_quit_to_stop)
                interactResponse(message, addRuleJSON["flags"], "message")
            }
            else{
                try{
                    curUserVal.push(client.users.cache.find(user => user.username === message.content).id)
                    message.reply(message_trigger_other_user + type_quit_to_stop)
                }
                catch (error){
                    message.reply(invalid_try_again + message_trigger_other_user + type_quit_to_stop)
                }
            }
        }
        fs.writeFile(message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })
    })
}

function addVoice(client, message) {
    // TODO. set flags to ignore message reply, message react, and message delete
    fs.readFile("./" + message.author.id + "user.json", (err, data) => {
        if (err) throw err
        let addRuleJSON = JSON.parse(data.toString())
        let completeFlag = addRuleJSON["flags"]
        let currentKey = addRuleJSON[Object.keys(addRuleJSON)[5]]
        if(completeFlag & 0x1){
            if(!(completeFlag & 0x2)){
                let curUserVal = currentKey["conditions"]["voice user logout"]
                if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                    addRuleJSON["flags"] = completeFlag | 0x2
                    addRuleJSON["flags"] = 0x80000038
                    message.reply(done_setting_conditions + response_which_text + type_quit_to_stop)
                }
                else{
                    try{
                        curUserVal.push(client.users.cache.find(user => user.username === message.content).id)
                        message.reply(voice_trigger_other_logout + type_quit_to_stop)
                    }
                    catch (error){
                        message.reply(invalid_try_again + voice_trigger_other_logout + type_quit_to_stop)
                    }
                }
            }
        }
        else{
            let curUserVal = currentKey["conditions"]["voice user login"]
            if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                addRuleJSON["flags"] = completeFlag | 0x1
                //message.reply(message_trigger_which_keyword + type_quit_to_stop)
                interactResponse(message, addRuleJSON["flags"], "voice")
            }
            else{
                try{
                    curUserVal.push(client.users.cache.find(user => user.username === message.content).id)
                    message.reply(voice_trigger_other_login + type_quit_to_stop)
                }
                catch (error){
                    message.reply(invalid_try_again + voice_trigger_other_login + type_quit_to_stop)
                }
            }
        }
        fs.writeFile(message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })
    })
}

function addCondition(client, message) {
    fs.readFile("./" + message.author.id + "user.json", (err, data) => {
        if (err) throw err
        let addRuleJSON = JSON.parse(data.toString())
        let completeFlag = addRuleJSON["flags"]
        let currentKey = addRuleJSON[Object.keys(addRuleJSON)[5]]
        if(completeFlag & 0x1){
            if(completeFlag & 0x2){
                if(completeFlag & 0x4){
                    if(completeFlag & 0x8){
                        if(completeFlag & 0x10){
                            if(completeFlag & 0x20){
                                if(completeFlag & 0x40){
                                    if(completeFlag & 0x80){
                                        if(message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "y"){
                                            addCompletedRule(addRuleJSON)
                                            addRuleJSON["timestamp"] = Date.now() - 1000000
                                            message.reply(rule_added)
                                        }
                                        else if(message.content.toLowerCase() === "no" || message.content.toLowerCase() === "n"){
                                            addRuleJSON["timestamp"] = Date.now() - 1000000
                                            message.reply(rule_not_added)
                                        }
                                        else{
                                            message.reply(invalid_try_again + type_quit_to_stop)
                                        }
                                    }
                                    else{                       // can only voice on one channel
                                        if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                                            addRuleJSON["flags"] = completeFlag | 0x80
                                            //message.reply("Complete")
                                            let returnRuleList = ask_to_add_rule
                                            returnRuleList += Object.keys(addRuleJSON)[5] + JSON.stringify(currentKey).replace(/{/gi, "\n").replace(/}/gi, "\n").replace(/,/gi, "\n") + "\n"
                                            message.reply(returnRuleList)
                                        }
                                        else{
                                            try {
                                                currentKey["response"]["voice channel"] = client.channels.cache.find(channel => channel.name === message.content).id
                                                addRuleJSON["flags"] = completeFlag | 0x80
                                                //message.reply("Complete")
                                                let returnRuleList = ask_to_add_rule
                                                returnRuleList += Object.keys(addRuleJSON)[5] + JSON.stringify(currentKey).replace(/{/gi, "\n").replace(/}/gi, "\n").replace(/,/gi, "\n") + "\n"
                                                message.reply(returnRuleList)
                                            }
                                            catch (error){
                                                message.reply(invalid_try_again + response_which_voice_channel + type_quit_to_stop)
                                            }
                                        }
                                    }
                                }
                                else{
                                    if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                                        addRuleJSON["flags"] = completeFlag | 0xC0
                                        //message.reply("Complete")
                                        let returnRuleList = ask_to_add_rule
                                        returnRuleList += Object.keys(addRuleJSON)[5] + JSON.stringify(currentKey).replace(/{/gi, "\n").replace(/}/gi, "\n").replace(/,/gi, "\n") + "\n"
                                        message.reply(returnRuleList)
                                    }
                                    else{
                                        if(message.content.substring(0,6) === "/home/" && fs.existsSync(message.content)){
                                            currentKey["response"]["voice play audio"] = message.content
                                            addRuleJSON["flags"] = completeFlag | 0x40
                                            //message.reply(response_which_voice_channel + type_quit_to_stop)
                                            interactResponse(message, addRuleJSON["flags"], "")
                                        }
                                        else if(message.content.substring(0,4) === "http")
                                        {
                                            currentKey["response"]["voice play audio"] = message.content
                                            addRuleJSON["flags"] = completeFlag | 0x40
                                            //message.reply(response_which_voice_channel + type_quit_to_stop)
                                            interactResponse(message, addRuleJSON["flags"], "")
                                        }
                                        else{
                                            message.reply("|\n" + bad_format + response_which_voice_file + type_quit_to_stop)
                                        }
                                    }
                                }
                            }
                            else{
                                if(message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "y"){
                                    currentKey["response"]["message delete"] = true
                                    addRuleJSON["flags"] = completeFlag | 0x20
                                    //message.reply(response_which_voice_file + type_quit_to_stop + response_which_voice_rules)
                                    interactResponse(message, addRuleJSON["flags"], "")
                                }
                                else if(message.content.toLowerCase() === "no" || message.content.toLowerCase() === "n"){
                                    currentKey["response"]["message delete"] = false
                                    addRuleJSON["flags"] = completeFlag | 0x20
                                    //message.reply(response_which_voice_file + type_quit_to_stop + response_which_voice_rules)
                                    interactResponse(message, addRuleJSON["flags"], "")
                                }
                                else{
                                    message.reply(invalid_try_again + response_is_delete + type_quit_to_stop)
                                }
                            }
                        }
                        else{
                            if(message.content.toLowerCase() === "yes" || message.content.toLowerCase() === "y"){
                                currentKey["response"]["message reply"] = true
                                addRuleJSON["flags"] = completeFlag | 0x10
                                //message.reply(response_is_delete + type_quit_to_stop)
                                interactResponse(message, addRuleJSON["flags"], "")
                            }
                            else if(message.content.toLowerCase() === "no" || message.content.toLowerCase() === "n"){
                                currentKey["response"]["message reply"] = false
                                addRuleJSON["flags"] = completeFlag | 0x10
                                //message.reply(response_is_delete + type_quit_to_stop)
                                interactResponse(message, addRuleJSON["flags"], "")
                            }
                            else{
                                message.reply(invalid_try_again + response_is_reply + type_quit_to_stop)
                            }
                        }
                    }
                    else{
                        let curUserVal = currentKey["response"]["message react emoji"]
                        if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                            addRuleJSON["flags"] = completeFlag | 0x8
                            //message.reply(response_is_reply + type_quit_to_stop)
                            interactResponse(message, addRuleJSON["flags"], "")
                        }
                        else{
                            curUserVal.push(message.content)
                            message.reply(response_other_emoji + type_quit_to_stop)
                        }
                    }
                }
                else{                       // can only respond to one channel
                    //let curUserVal = currentKey["response"]["message channel"]
                    if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                        addRuleJSON["flags"] = completeFlag | 0x4
                        //message.reply(response_which_emoji + type_quit_to_stop)
                        interactResponse(message, addRuleJSON["flags"], "")
                    }
                    else{
                        try {
                            currentKey["response"]["message channel"] = client.channels.cache.find(channel => channel.name === message.content).id
                            //curUserVal.push(client.channels.cache.find(channel => channel.name === message.content).id)
                            addRuleJSON["flags"] = completeFlag | 0x4
                            //message.reply("If this rule reacts with an emoji, which one (\"[n]one\" to skip)? This is only valid on a message event. (type \"quit\" to stop)")
                            interactResponse(message, addRuleJSON["flags"], "")
                        }
                        catch (error){
                            message.reply(invalid_try_again + response_which_channel + type_quit_to_stop)
                        }
                    }
                }
            }
            else{
                let curUserVal = currentKey["response"]["message attachment"]
                if(message.content.toLowerCase() === "none" || message.content.toLowerCase() === "n"){
                    if(currentKey["response"]["message contents"].length == 0 && currentKey["response"]["message attachment"].length == 0){
                        addRuleJSON["flags"] = completeFlag | 0x16
                    }
                    else{
                        addRuleJSON["flags"] = completeFlag | 0x2
                    }
                    interactResponse(message, addRuleJSON["flags"], "")
                }
                else{
                    if(message.content.substring(0,6) === "/home/" && fs.existsSync(message.content)){
                        curUserVal.push(message.content)
                        message.reply(response_other_attachment + type_quit_to_stop)
                    }
                    else if(message.content.substring(0,4) === "http")
                    {
                        curUserVal.push(message.content)
                        message.reply(response_other_attachment + type_quit_to_stop)
                    }
                    else{
                        message.reply(bad_format + response_which_attachment + type_quit_to_stop + response_which_attachment_rules)
                    }

                }
            }
        }
        else{
            if(message.content.toLowerCase() !== "none" && message.content.toLowerCase() !== "n"){
                currentKey["response"]["message contents"] = message.content
            }
            addRuleJSON["flags"] = completeFlag | 0x1
            //message.reply(response_which_attachment + type_quit_to_stop + response_which_attachment_rules)
            interactResponse(message, addRuleJSON["flags"], "")
        }
        fs.writeFile(message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })
    })
}

function interactResponse(message, flags, event) {
    if (flags & 0x80000000){
        if(flags & 0x1){
            if(flags & 0x2){
                if(flags & 0x4){
                    if(flags & 0x8){
                        if(flags & 0x10){
                            if(flags & 0x20){
                                if(flags & 0x40){
                                    message.reply(response_which_voice_channel + type_quit_to_stop)
                                    return
                                }
                                message.reply("|\n" + response_which_voice_file + type_quit_to_stop + response_which_voice_rules)
                                return
                            }
                            message.reply(response_is_delete + type_quit_to_stop)
                            return
                        }
                        message.reply(response_is_reply + type_quit_to_stop)
                        return
                    }
                    message.reply(response_which_emoji + type_quit_to_stop)
                    return
                }
                message.reply(response_which_channel + type_quit_to_stop)
                return
            }
            message.reply(response_which_attachment + type_quit_to_stop + response_which_attachment_rules)
            return
        }
    }
    else{
        if(event === "message"){
            if(flags & 0x1){
                if(flags & 0x2){
                    if(flags & 0x4){
                        if(flags & 0x8){
                            message.reply(message_trigger_is_file + type_quit_to_stop)
                            return
                        }
                        message.reply(message_trigger_which_channel + type_quit_to_stop)
                        return
                    }
                    message.reply(message_trigger_which_role + type_quit_to_stop)
                    return
                }
                message.reply(message_trigger_which_keyword + type_quit_to_stop)
                return
            }
        }
        else if(event === "voice"){
            if(flags & 0x1){
                message.reply(voice_trigger_who_logout + type_quit_to_stop)
                return
            }
        }
    }
}

function addCompletedRule(addRuleJSON) {
    fs.readFile(rulesPath, (err, data) => {
        if (err) throw err
        let rules = JSON.parse(data.toString())
        rules[Object.keys(addRuleJSON)[5]] = addRuleJSON[Object.keys(addRuleJSON)[5]]
        fs.writeFile(rulesPath, JSON.stringify(rules), (err) => {
            if (err) throw err;
        })
    })
}