exports.echoMessage = function(client, message, channel) {
    newMessage = {}
    newMessage["content"] = message.content

    if (message.attachments.first() != null){
        newMessage["files"] = [message.attachments.first().url]
    }

    client.channels.fetch(channel)
    .then(channel => {
        channel.send(newMessage)
    }).catch(console.error)
}