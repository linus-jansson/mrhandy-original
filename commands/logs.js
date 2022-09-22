const error = require('../storage/messages.json');
const Discord = require('discord.js');
const mysql = require('mysql');
const Database = require('../classes/database');

exports.run = async (client, message, args, command) => {

  if (message.guild) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply(error.noPerm);
    } else {
      if (args[0] === "disable" || args[0] === "0" || args[0] === "false" || args[0] === "off") {
        var log = await getLog(message.guild.id);
        if (0 == log) {
          return message.reply(`Logs are already off`);
        } else if( 1 == log ){
          await setLog(message.guild.id, 0);
          message.guild.channels.find("name", "logs").delete();
          message.reply("Logs are now disabled, removed the channel").then(msg => {msg.delete(10000)}).catch();;
        }
        else {
          console.log("Got log = "+log+" after disable?");
        }
      } else if (args[0] === "enable" || args[0] === "1" || args[0] === "true" || args[0] === "on") {
        var log = await getLog(message.guild.id);
        if (1 == log) {
          return message.reply(`Logs are already on`);
        } else if( 0 == log )  {
          await setLog(message.guild.id, 1);
          message.guild.createChannel("logs", "text");
          message.reply("Logs are now enabled, created a channel").then(msg => {msg.delete(10000)}).catch();
        }
        else {
          console.log("Got log = "+log+" after enable?");
        }
      } else {
        message.reply("Please choose **(enable, true, 1)** or **(disable, false, 0)**");
      }
    }

  } else {
    return message.reply(error.noGuild);
  }

  async function setLog(guild_id, log_on) {
    var Con = new Database();
    Con.query(`UPDATE settings SET log=${log_on} WHERE guild_id='${guild_id}' LIMIT 1`).then( rows => {
      //console.log(`Set log ${log_on}`);
    }).then( rows => Con.close() );
  }

  async function getLog(guild_id) {
    var Con = new Database();
    var count = 0;
    var log = -1;
    await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then( rows => {
      count = parseInt(rows[0].N);
      if( 0 == count )
        return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then( () => {
          return Con.query(`SELECT log FROM settings WHERE guild_id='${guild_id}'`);
        });
      else
        return Con.query(`SELECT log FROM settings WHERE guild_id='${guild_id}'`);
    }).then( rows => {
        log = parseInt(rows[0].log);
        //console.log("Got log "+log+" from database");
        return Con.close();
    });
    return log;
  }

}
