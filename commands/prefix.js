const Discord = require("discord.js");
const fs = require("fs");
const error = require('../storage/messages.json');
const mysql = require('mysql');
const Database = require('../classes/database');

module.exports.run = async (client, message, args) => {

  if (message.guild) {
    if (!args[0]) {
      if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.reply(error.noPerm);
      } else {
        var prefix = await getPrefix(message.guild.id);
        var defaultPrefix = "+";
          if (prefix == defaultPrefix) {
            return message.reply(`Usage: ${prefix}prefix [desired prefix]`);
          } else {
            await setPrefix(message.guild.id, "+");
            let sEmbed = new Discord.RichEmbed()
              .setColor("#FF9900")
              .setTitle("Prefix Set!")
              .setDescription(`Prefix set to default: +`);
            message.channel.send(sEmbed);
          }
      }

    } else {
      if (new RegExp("[a-zA-Z0-9]").test(args[0])) {
        return message.reply("Usage: ${prefix}prefix [desired prefix]");
      } else {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
          return message.reply(error.noPerm);
        }


        await setPrefix(message.guild.id, args[0])

        let sEmbed = new Discord.RichEmbed()
          .setColor("#FF9900")
          .setTitle("Prefix Set!")
          .setDescription(`Set to ${args[0]}`);

        let dmEmbed = new Discord.RichEmbed()
          .setColor("#FF9900")
          .setTitle("Prefix Set!")
          .setDescription(`Prefix was set to ${args[0]} on ${message.guild.name}. If you forget the prefix do **@Mr Handy#5331 prefix**.`);


        message.channel.send(sEmbed);
        message.author.send(dmEmbed);
      }
    }
  } else {
    message.author.send(error.noGuild);
  }

  async function setPrefix(guild_id, prefix) {
    var Con = new Database();
    Con.query(`UPDATE settings SET prefix='${prefix}' WHERE guild_id='${guild_id}'`).then(rows => {

    }).then(rows => Con.close());
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

}
