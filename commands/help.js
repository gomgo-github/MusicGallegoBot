module.exports.permissionRequired = 0;

module.exports.run = async (client, message, args, config) => {
  let command = args[0];

  if (!command || command === "help") {
    var text = "**__COMANDOS__**\n";
    for (let [command, props] of client.commands) {
      if (command === "help") continue;
      text += "• `" + command + "`\n";
    }

    text += `\nPara saber más acerca de un comando en especifico, escribe ${config.prefix}help <comando>\n`;

    message.channel.send(text);
  } else {
    command = client.commands.get(command);
    var text = `**Comando:** ${command.help.name}\n**Descripción:** ${
      command.help.description || "Este comando no tiene descripción"
    }\n**Como usar:** ${config.prefix}${command.help.usage || "Este comando no tiene instrucciones específicas"}`;

    message.channel.send(text);
  }
};

module.exports.help = {
  name: "help",
};
