exports.echoMessage = function(client, message, channel) {
    newMessage = {}

    newMessage["content"] = message.content

    if (newMessage["content"].toLowerCase().includes("yub nub")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/yub nub/gi, newID)
    }
    if (newMessage["content"].toLowerCase().includes("michael")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/michael kowpak/gi, newID)
        newMessage["content"] = newMessage["content"].replace(/michael/gi, newID)
    }
    if (newMessage["content"].toLowerCase().includes("kowpak")){
        let newID = client.users.cache.find(user => user.id === message.author.id)
        newMessage["content"] = newMessage["content"].replace(/michael kowpak/gi, newID)
        newMessage["content"] = newMessage["content"].replace(/kowpak/gi, newID)
    }

    if (message.attachments.first() != null){
        newMessage["files"] = [message.attachments.first().url]
    }

    client.channels.fetch(channel)
    .then(channel => {
        channel.send(newMessage)
    }).catch(console.error)
}