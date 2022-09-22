const Discord = require("discord.js");
const Database = require('../classes/database');
const error = require('../storage/messages.json');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
    var logs = "Disabled"
  } else {
    var logs = "Enabled"
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
    var serverProtect = "Spam protection is off"
  } else if (protect == 1) {
    var serverProtect = "Spam protection is on"
  } else {
    console.log("Got log " + protect + " from database");
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
  async function editSettings() {
    // Await !vote messages
    const filter = m => m.content.startsWith('1');
    // Errors: ['time'] treats ending because of the time limit as an error
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
      })
      .then(collected => console.log(collected.size))
      .catch(collected => console.log(`Timeout.`));
       // Fixa så Await message på siffra och sen så att den väntar på en value
      for (var i = 0; i < array.length; i++) {
        array[i]
      }
  }

  var prefix = await getPrefix(message.guild.id);


  // Embed
  var getRandomColor = randomColor();

  let sIcon = message.guild.iconURL;
  let settingEmbed = new Discord.RichEmbed();
  settingEmbed.setAuthor("Server settings", sIcon)
  settingEmbed.setColor(getRandomColor)
  settingEmbed.addField(`1, log channel (${prefix}logs)`, logs)
  settingEmbed.addField(`2, Prefix is (${prefix}prefix)`, prefix)
  settingEmbed.addField(`3, Spam Protection (${prefix}protect)`, serverProtect)
  settingEmbed.addFooter(`If you want to edit one of these do ${prefix}settings edit & then the number you want to edit`);

  // send Embed
  if (args[0] == "edit") {
    // editSettings();
  }
  if (message.guild) {
    var logChannel = message.guild.channels.find('name', 'logs');
    if (!logChannel) {
      return message.channel.send(settingEmbed);
    } else if (logChannel) {
      return logChannel.send(settingEmbed);
    }
  } else {
    message.reply(error.noGuild);
  }
}
