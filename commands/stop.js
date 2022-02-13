module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ No estás en ningún canal de voz!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No está sonando nada!")

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end()
  return message.channel.send("⏹ Ya he quitado la música, me voy del VC!")
}

module.exports.help = {
  name: "stop",
  description: "Para la música y se desconecta",
  usage: "stop",
};
