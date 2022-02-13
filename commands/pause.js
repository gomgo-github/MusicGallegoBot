module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ No estás en un canal de voz!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No está sonando nada!")
  if (!serverQueue.playing) return message.channel.send("❌ Ya está pausado!")

  serverQueue.playing = false
  serverQueue.connection.dispatcher.pause(true)
  return message.channel.send("⏸ Se ha pausado el Audio!")
}

module.exports.help = {
  name: "pause",
  description: "Pausa el audio que está sonando",
  usage: "pause",
};
