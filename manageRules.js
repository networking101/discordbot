const fs = require("fs")

const rulesPath = "./rules.json"
//const rulesPath = "/home/pi/urdumbot/rules.json"
const path = "./"
//const path = "/home/pi/urdumbot/"

exports.manageRules = function(client, message) {
    //console.log(message.content);

    if(message.content.length == 2 && message.content.charAt(1) === '?'){
        message.reply("|\nBot Management\n\n$list         ->  list rules        ('$list' or '$list rulename 1, rulename 2, ...')\n$add        ->  add rule        (follow prompt)\n$delete   ->  delete rule    ('delete rulename 1')")
    }
    else if(message.content.includes("$list")){
        if(message.content.length == 5){
            fs.readFile(rulesPath, (err, rulesData) => {
                if (err) throw err
                let returnRuleList = ""
                let rules = JSON.parse(rulesData.toString())
                for (let x in rules){
                    returnRuleList += "\n" + x
                }
                message.reply("|\nRule List:\n" + returnRuleList)
            })
        }
        else if (message.content.charAt(5) === " ")
        {
            let ruleList = message.content.slice(5).trim().split(/,+/g)
            fs.readFile(rulesPath, (err, rulesData) => {
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
    else if(message.content.length == 4 && message.content.includes("$add")){
        /*if (fs.readFileSync(addRulePath)){
            message.channel.send("What the fuck are you trying to do?")
        }*/
        let addRuleJSON = {}
        addRuleJSON["name"] = message.author.id
        addRuleJSON["channel"] = message.channel.id
        addRuleJSON["timestamp"] = Date.now()

        fs.writeFile(path + message.author.id + "user.json", JSON.stringify(addRuleJSON), (err) => {
            if (err) throw err;
        })

        message.reply("What is the name of the new rule? (type \"quit\" to stop)")
    }
    else if(message.content.includes("$delete")){
        if (message.content.charAt(7) === " "){
            let returnRuleList = ""
            let ruleList = message.content.slice(7).trim().split(/,+/g)
            fs.readFile(rulesPath, (err, rulesData) => {
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
                fs.writeFile(rulesPath, JSON.stringify(rules), (err) => {
                    if (err) throw err;
                })
            })
        }
    }
    else{
        message.reply("Not a command. If you are trying to add a command, drop the '$' when setting options")
    }
}