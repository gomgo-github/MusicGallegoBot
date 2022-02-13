module.exports.permissionRequired = 0

module.exports.run = async (client, message, args, config, queue) => {
  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No hay nada sonando ahora mismo")

  return message.channel.send(`🎶 Ahora mismo esta sonando: **${serverQueue.songs[0].title}**`)
}

module.exports.help = {
  name: "np",
  description: "Te dice que esta sonando ahora",
  usage: "np",
};
