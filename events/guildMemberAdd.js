const Discord = require("discord.js");
const Database = require('../classes/database');

exports.run = async (client, ...args) => {
  var getRole = await getDefaultRole(args[0].guild.id);
  var role = args[0].guild.roles.find(`name`, `${getRole}`);

  var getMessage = await getJoinMessage(args[0].guild.id);

  if (getRole == null) {
    return;
    // return console.log("No Default join Role is set: " + getRole + " " + args[0].guild.id + " " + args[0].guild.name);
  } else {
    if (role) {
      args[0].addRole(role);
    }
  }
  // För att detta ska funka så ska man sätta en default kanal
  // sen bör jag fixa alla guild settings in i settings commandot
  // så man kan skriva prefix Settings edit [bla bla bla] och sen välja ny value

  if (getMessage == null) {
    return;
  } else {
    args[0].author.send(getMessage);
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


};
