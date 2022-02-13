module.exports.permissionRequired = 0

const fetch = require("node-fetch");
let bestRegion; fetch("https://best.discord.media/region").then(res => res.text()).then(region => bestRegion = region.replace("\n", "")).catch()

module.exports.run = async (client, message, args, config, queue) => {
  const botMsg = await message.channel.send("〽 Pinging ...");
  botMsg.edit(`🏓 Pong! Latencia de \`${botMsg.createdTimestamp - message.createdTimestamp}ms\` y Latencia del API de \`${Math.round(client.ws.ping)}ms\`${bestRegion && bestRegion !== message.guild.region ? "\n❗ Mejor región (Para PING) \`" + bestRegion + "\`, Cambia el canal a esa región si notas problemas de Audio." : ""}`);
}

module.exports.help = {
  name: "ping",
  description: "Latencia del Bot y info relacionada",
  usage: "ping",
};
