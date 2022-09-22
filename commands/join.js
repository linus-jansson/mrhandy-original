const Discord = require("discord.js");
const error = require('../storage/messages.json');
const Database = require('../classes/database');

module.exports.run = async (client, message, args) => {

  // Join Role variables
  var default_role = await getDefaultRole(message.guild.id);
  let roleExits = message.guild.roles.find(`name`, args.slice(1).join(' '));

  // Join message variables
  var join_message = await getDefaultRole(message.guild.id);


  if (message.guild) {
    if (args[0] == "role") {
      if (args[1]) {
        if (default_role !== args.slice(1).join(' ')) {
          if (roleExits) {
            setDefaultRole(message.guild.id, args.slice(1).join(' '))
            return message.reply("Default role were set to: " + args.slice(1).join(' '));
          } else {
            return message.reply("That role does not exist, If you want that role to be set as default please create one.");
          }
        } else {
          return message.reply("the " + default_role + " role is already set as join role")
        }

      } else {
        message.reply("A valid role name is required as an argument to set a default join role")
      }
    } else if (args[0] == "message") {
      return await setJoinMessage(message.guild.id, args.slice(1).join(' '));
    } else {
      if (default_role == null) {
        message.reply("No default_role is set");
      } else if (Type(default_role, String) === true ) {
        message.reply("default_role is " + default_role);
      }
    }
  } else {
    return message.reply(error.noGuild);
  }

  async function setDefaultRole(guild_id, default_role) {
    var Con = new Database();
    Con.query(`UPDATE settings SET default_role='${default_role}' WHERE guild_id='${guild_id}'`).then(rows => {

    }).then(rows => Con.close());
  }

  async function getDefaultRole(guild_id) {
    var Con = new Database();
    var count = 0;
    var default_role = null;
    await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
      count = parseInt(rows[0].N);
      if (0 == count)
        return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
          return Con.query(`SELECT default_role FROM settings WHERE guild_id='${guild_id}'`);
        });
      else
        return Con.query(`SELECT default_role FROM settings WHERE guild_id='${guild_id}'`);
    }).then(rows => {
      default_role = rows[0].default_role;

      return Con.close();
    });
    return default_role;

  }




  async function setJoinMessage(guild_id, join_message) {
    var Con = new Database();
    Con.query(`UPDATE settings SET join_message='${join_message}' WHERE guild_id='${guild_id}'`).then(rows => {

    }).then(rows => Con.close());
  }

  async function getJoinMessage(guild_id) {
    var Con = new Database();
    var count = 0;
    var join_message = null;
    await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
      count = parseInt(rows[0].N);
      if (0 == count)
        return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
          return Con.query(`SELECT join_message FROM settings WHERE guild_id='${guild_id}'`);
        });
      else
        return Con.query(`SELECT join_message FROM settings WHERE guild_id='${guild_id}'`);
    }).then(rows => {
      join_message = rows[0].join_message;

      return Con.close();
    });
    return join_message;

  }

}
