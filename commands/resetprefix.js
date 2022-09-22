const Discord = require('discord.js');
const Database = require('../classes/database');
const error = require('../storage/messages.json');

exports.run = async (client, message, args, command) => {
  if (message.guild) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply(error.noPerm);
    } else {
      if (await getPrefix(message.guild.id) !== "+") {
        await setPrefix(message.guild.id, "+");
        var prefix = await getPrefix(message.guild.id);
        let sEmbed = new Discord.RichEmbed()
          .setColor("#FF9900")
          .setTitle("Prefix Set!")
          .setDescription(`Set to ${prefix}`);
        message.channel.send(sEmbed);
      } else {
        message.reply("Prefix is already default. Do +help for help");
      }
    }
  } else {
    return message.reply(error.noGuild);
  }

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

  async function setPrefix(guild_id, prefix) {
    var Con = new Database();
    Con.query(`UPDATE settings SET prefix='${prefix}' WHERE guild_id='${guild_id}'`).then( rows => {
  //    console.log(`Set log ${prefix}`);
    }).then( rows => Con.close() );
  }
}
