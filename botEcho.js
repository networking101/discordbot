const config = require("/home/mike/bottestingserver/config.json");

exports.echoMessage = function(client, message, channel) {
    let newMessage = {}
    let flag = 0

    newMessage["content"] = message.content

    if (newMessage["content"].toLowerCase().includes("<@!" + config.myid + ">")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/<.*?>/gi, newID)
        flag += 1
    }
    if (newMessage["content"].toLowerCase().includes("yub nub")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/yub nub/gi, newID)
        flag += 1
    }
    if (newMessage["content"].toLowerCase().includes("michael")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/michael kowpak/gi, newID)
        newMessage["content"] = newMessage["content"].replace(/michael/gi, newID)
        flag += 1
    }
    if (newMessage["content"].toLowerCase().includes("kowpak")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/michael kowpak/gi, newID)
        newMessage["content"] = newMessage["content"].replace(/kowpak/gi, newID)
        flag += 1
    }

    if (message.attachments.first() != null){
        newMessage["files"] = [message.attachments.first().url]
    }


    try{
        client.channels.fetch(channel)
        .then(channel => {
            channel.send(newMessage)
        }).catch(console.error)
    }
    catch (error){
        try{
            client.users.fetch(channel)
            .then(user => {
                newMessage["content"] = message.content
                channel.send(newMessage)
            })
            return
        }
        catch (err){
            console.log(err)
        }
    }
}