module.exports.permissionRequired = 0

const ytdl = require("ytdl-core"), ytpl = require("ytpl"), ytsr = require("ytsr"), { Util } = require("discord.js");

module.exports.run = async (client, message, args, config, queue) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("❌ No estás en ningun canal de voz, unete a uno antes!")

  const permissions = voiceChannel.permissionsFor(message.guild.me)
  if (!permissions.has("CONNECT")) return message.channel.send("❌ No tengo permisos para unirme a ese canal de voz!")
  if (!permissions.has("SPEAK")) return message.channel.send("❌ No tengo permisos para hablar en ese canal de voz!")

  if (!args.length) return message.channel.send("❌ Busca un vídeo, o dame una URL!")

  const url = args.join(" ")
  if (url.includes("list=")) {
    const playlist = await ytpl(url.split("list=")[1])
    const videos = playlist.items;

    message.channel.send(`✅ Playlist **${playlist.title}** (${videos.length}) Añadida a la cola!`)

    for (const video of videos) await queueSong(video, message, voiceChannel, queue)
  } else {
    let video;
    try {
      video = await ytdl.getBasicInfo(url)
    } catch(e) {
      try {
        const results = await ytsr(url, { limit: 10 })
        const videos = results.items
        let index = 0;

        if (!videos.length) return message.channel.send("❌ No se encontraron resultados.")

        await message.channel.send([
          "__**Song selection:**__",
          videos.map(v => `${++index} - **${v.title}**`).join("\n"),
          `**Selecciona tu canción escribiendo en el chat un numero del 1 al ${videos.length}.**`
        ].join("\n\n"))

        let response;
        try {
          response = await message.channel.awaitMessages(msg => 0 < parseInt(msg.content) && parseInt(msg.content) < videos.length + 1 && msg.author.id == message.author.id, {
            max: 1,
            time: 30000,
            errors: ['time']
          });
        } catch(e) {
          return message.channel.send("❌ Se acabó tu tiempo para escoger, vuelve a intentarlo.")
        }
        const videoIndex = parseInt(response.first().content)
        video = await ytdl.getBasicInfo(videos[videoIndex - 1].link.split("?v=")[1])
      } catch(e) {
        console.log(e)
        return message.channel.send("❌ Ups, me he cargao algo, pero no sé lo que, vuelve a intentarlo.")
      }
    }
    
    await message.channel.send(`✅ Audio **${video.videoDetails.title}** añadido a la cola!`)
    return await queueSong(video, message, voiceChannel, queue)
  }
}

async function queueSong(video, message, voiceChannel, queue) {
  const serverQueue = queue.get(message.guild.id)

  const song = {
    id: video.videoDetails.videoId,
    title: Util.escapeMarkdown(video.videoDetails.title),
    url: video.videoDetails.video_url
  }

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel,
      connection: null,
      songs: [song],
      volume: 50,
      playing: true
    }

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      queue.set(message.guild.id, queueConstruct)
      playSong(message.guild, queue, queueConstruct.songs[0])
    } catch(e) {
      console.log(e)
      message.channel.send("❌ Hubo algun error extraño intentando acceder al canal de voz, intentalo de nuevo o prueba en otro diferente!")
      return queue.delete(message.guild.id)
    }
  } else serverQueue.songs.push(song);

  return;
}

async function playSong(guild, queue, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  serverQueue.connection.play(ytdl(song.id), { bitrate: 'auto' })
    .on("speaking", speaking => {
      if (!speaking) {
        serverQueue.songs.shift();
        playSong(guild, queue, serverQueue.songs[0])
      }
    })
    .on("error", console.error)
    .setVolumeLogarithmic(serverQueue.volume / 250)
  
  serverQueue.textChannel.send(`🎶 Está sonando: **${song.title}**`)
}

module.exports.help = {
  name: "play",
  description: "Reproduce el Audio que quieras en el Chat de Voz (VC)",
  usage: "play <url o nombre>",
};
