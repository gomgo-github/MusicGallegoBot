module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ No estás en ningún canal de voz!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No hay nada sonando!")
  if (serverQueue.playing) return message.channel.send("❌ El contenido no está pausado, ya está sonando algo!")

  serverQueue.playing = true
  serverQueue.connection.dispatcher.resume()
  return message.channel.send("▶ Se reanudo la reproducción!")
}

module.exports.help = {
  name: "resume",
  description: "Reanuda el audio previamente pausado",
  usage: "resume",
};
