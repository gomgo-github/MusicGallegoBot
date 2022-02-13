module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ No estás en ningún canal de voz!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No está sonando nada!")

  await message.channel.send("⏭ Se saltó la cancion que estaba sonando!")
  return serverQueue.connection.dispatcher.end()
}

module.exports.help = {
  name: "skip",
  description: "Se salta la canción que está sonando y pasa directamente a la siguiente",
  usage: "skip",
};
