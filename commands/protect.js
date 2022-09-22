const Discord = require("discord.js");
const Database = require('../classes/database');
const error = require('../storage/messages.json');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (message.guild) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply(error.noPerm);
    } else {
      if (args[0] === "disable" || args[0] === "0" || args[0] === "false" || args[0] === "off") {
        var protect = await getServerProtect(message.guild.id);
        if (0 == protect) {
          return message.reply(`Server protect are already off`);
        } else if( 1 == protect ){
          await setServerProtect(message.guild.id, 0);
          message.reply("Server protect are now disabled, removed the channel");
        }
        else {
          console.log("Got log = "+protect+" after disable?");
        }
      } else if (args[0] === "enable" || args[0] === "1" || args[0] === "true" || args[0] === "on") {
        var protect = await getServerProtect(message.guild.id);
        if (1 == protect) {
          return message.reply(`Server protect are already on`);
        } else if( 0 == protect )  {
          await setServerProtect(message.guild.id, 1);
          message.reply("Server protect are now enabled, created a channel. \n Keep in mind, this command is right now very experimental. Use at your own risk");
        }
        else {
          console.log("Got log = "+protect+" after enable?");
        }
      } else {
        message.reply("Please choose **(enable, true, 1, on)** or **(disable, false, 0, off)**");
      }
    }

  } else {
    return message.reply(error.noGuild);
  }

  async function getServerProtect(guild_id) {
    var Con = new Database();
    var count = 0;
    var protect = -1;
    await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
      count = parseInt(rows[0].N);
      if (0 == count)
        return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
          return Con.query(`SELECT spamprotection FROM settings WHERE guild_id='${guild_id}'`);
        });
      else
        return Con.query(`SELECT spamprotection FROM settings WHERE guild_id='${guild_id}'`);
    }).then(rows => {
      protect = parseInt(rows[0].spamprotection);
      //console.log("Got log "+log+" from database");
      return Con.close();
    });
    return protect;
  }
  protect = await getServerProtect(message.guild.id);
  if (protect == 0) {
    var serverProtect = "Server protect is disabled "
  } else if (protect == 1) {
    var serverProtect = "Server protect is enabled"
  } else {
    console.log("Got log "+protect+" from database");
  }
  async function setServerProtect(guild_id, protectSetting) {
    var Con = new Database();
    Con.query(`UPDATE settings SET spamprotection=${protectSetting} WHERE guild_id='${guild_id}' LIMIT 1`).then( rows => {
      //console.log(`Set log ${log_on}`);
    }).then( rows => Con.close() );

    //UPDATE settings SET spamprotection=0 where spamprotection is null;

  }

}
