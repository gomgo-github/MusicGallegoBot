module.exports.permissionRequired = 0

module.exports.run = async (client, message, args, config, queue) => {
  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue || serverQueue.songs.length == 0) return message.channel.send("❌ No hay nada sonando ahora mismo!")
  if (serverQueue.songs.length == 1) return message.channel.send("❌ La cola está vacia!")

  return message.channel.send([
    "__**Cola:**__",
    serverQueue.songs.slice(1).map(song => `- ${song.title}`).join("\n"),
    `**Sonando ahora:** ${serverQueue.songs[0].title}`
  ].join("\n\n"))
}

module.exports.help = {
  name: "queue",
  description: "Te enseña la cola de Audio que va a sonar",
  usage: "queue",
};
