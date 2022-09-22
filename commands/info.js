const Discord = require("discord.js");
const Database = require('../classes/database');
const talkedRecently = new Set();
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
  if (message.guild) {
    async function getLog(guild_id) {
      var Con = new Database();
      var count = 0;
      var log = -1;
      await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
        count = parseInt(rows[0].N);
        if (0 == count)
          return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
            return Con.query(`SELECT log FROM settings WHERE guild_id='${guild_id}'`);
          });
        else
          return Con.query(`SELECT log FROM settings WHERE guild_id='${guild_id}'`);
      }).then(rows => {
        log = parseInt(rows[0].log);
        //console.log("Got log "+log+" from database");
        return Con.close();
      });
      return log;
    }
    log = await getLog(message.guild.id);
    if (log == 0) {
      var logs = "logs is disabled do +logs enable to enable "
    } else {
      var logs = "logs is enabled do +logs disable to disable"
    }
  } else {
    logs = "This is only available on servers"
  }

  if (message.guild) {
    async function getPrefix(guild_id) {
      var Con = new Database();
      var count = 0;
      var prefix = "+";
      await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
        count = parseInt(rows[0].N);
        if (0 == count)
          return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
            return Con.query(`SELECT prefix FROM settings WHERE guild_id='${guild_id}'`);
          });
        else
          return Con.query(`SELECT prefix FROM settings WHERE guild_id='${guild_id}'`);
      }).then(rows => {
        prefix = rows[0].prefix;
        //  console.log("Got prefix " + prefix + " from database");
        return Con.close();
      });
      return prefix;
    }
    var prefix = await getPrefix(message.guild.id);
  } else {
    prefix = "This is only available on servers"
  }
  // Embed
  var getRandomColor = randomColor();

  let bIcon = client.user.displayAvatarURL;
  let botEmbed = new Discord.RichEmbed();
  botEmbed.setAuthor("Bot & General info", "https://swedcraft.net/assets/icons/favicon.png")
  botEmbed.setColor(getRandomColor)
  botEmbed.setThumbnail(bIcon)
  botEmbed.setDescription(`Do ${prefix}settings to view the server settings for your server`)
  botEmbed.addField("Bot Name", client.user.username)
  botEmbed.addField("Bot Created On", client.user.createdAt)
  botEmbed.addField("Serving servers:", client.guilds.size)
  botEmbed.addBlankField(true)

  if (message.guild) {
    botEmbed.addField("Server Name", message.guild.name)
    // botEmbed.addField("Bot joined at", client.user.joinedAt)
    botEmbed.addField("Created On", message.guild.createdAt)
    botEmbed.addField("You Joined", message.member.joinedAt)
    botEmbed.addField("Total Members", message.guild.memberCount)
    botEmbed.addBlankField(true)
  }

  botEmbed.addField("Mr Handy's website", "https://swedcraft.net")
  // botEmbed.addField("Mr Handy's commands", "https://swedcraft.net/mrhandy")
  botEmbed.addField("Add Mr. Handy to your server", "https://discordapp.com/api/oauth2/authorize?client_id=463040101124145152&permissions=8&scope=bot")
  botEmbed.addField("Join Main discord", "https://discord.gg/BUHtEKt")

  // send Embed

  if (message.guild) {
    var logChannel = message.guild.channels.find('name', 'logs')
    if (args[0] == 'dm') {
      message.author.send(botEmbed);
    } else {
      if (!logChannel) {
        return message.channel.send(botEmbed);
      } else if (logChannel) {
        return logChannel.send(botEmbed);
      }
    }

  } else {
    message.author.send(botEmbed);
  }
}
