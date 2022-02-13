module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ No estás en ningún canal de voz!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ No está sonando nada!")

  if (!args[0]) return message.channel.send(`🔉 El volumen actual es de ${serverQueue.volume}`);

  const volume = parseInt(args[0])
  if (!volume || volume > 100) return message.channel.send("❌ Volumen inválido, tiene que ser entre 1 y 100!")

  serverQueue.volume = volume;
  serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 250);
  return message.channel.send(`🔊 He cambiado el volumen a ${volume}!`)
}

module.exports.help = {
  name: "volume",
  description: "Te dice el volumen actual de la música, tambien te deja cambiarlo",
  usage: "volume <opcional: nuevo valor del volumen>",
};
