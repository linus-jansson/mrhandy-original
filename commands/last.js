const mysql = require("mysql");
const error = require('../storage/messages.json')
const Database = require('../classes/database');
const Discord = require('discord.js');

function logCommand(guild_id, command, user) {
  var Con = new Database();
  Con.query(`INSERT INTO history(guild_id,command,user) VALUES('${guild_id}','${command}','${user}')`).then(rows => {
    purgeCommands(guild_id, Con);
    return Con.close();
  });
}

function purgeCommands(guild_id, connection) {
  var Con = new Database();
  Con.query(`SELECT COUNT(1) AS 'N' FROM history WHERE guild_id='${guild_id}'`).then(rows => {
    if (rows[0].N > 25) {
      Con.query(`DELETE FROM history WHERE guild_id='${guild_id}' AND logtime=(SELECT MIN(B.logtime) FROM (SELECT logtime FROM history WHERE guild_id='${guild_id}') AS B WHERE guild_id='${guild_id}') LIMIT 1`,
        function(e2, r2) {
          if (e2) console.log(e2);
        });
      purgeCommands(guild_id);
      return Con.close();
    }
  });
}

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-varsi

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return message.reply(error.noPerm);
  } else {
    // console.log('User ' + message.author.username + ' asked to see my last commands!');

    var Con = new Database();
    var historyNumber = parseInt(args[0], 10);

    if (message.guild) {

      if (!historyNumber) historyNumber = 2;

      if (historyNumber < 1 || historyNumber > 25)
       return message.reply('Please provide a number between 1 and 25 for the number of commands to display');


      // Ooooh nice, combined conditions. <3

      var prefix = "+";

      if (message.guild) {
        Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${message.guild.id}'`).then(rows => {
          count = parseInt(rows[0].N);
          if (0 == count) {
            return Con.query(`INSERT INTO settings(guild_id) VALUES('${message.guild.id}')`).then(() => {
              return Con.query(`SELECT prefix FROM settings WHERE guild_id='${message.guild.id}'`);
            });
          } else {
            return Con.query(`SELECT prefix FROM settings WHERE guild_id='${message.guild.id}'`);
          }
        }).then(rows => {
          prefix = rows[0].prefix;
        });
      }

      Con.query(`SELECT command,user,logtime FROM history WHERE guild_id='${message.guild.id}' ORDER by logtime DESC LIMIT ${historyNumber}`).then(rows => {
        var getRandomColor = randomColor();

        const embed = new Discord.RichEmbed();
        embed.setColor(getRandomColor);
        embed.setDescription("The last commands were:");
        for (i = 0; i < rows.length; i++) {
          embed.addField("Command", prefix + rows[i].command + " by: " + rows[i].user + " (@ " + rows[i].logtime + ")\n");
        }
        var logChannel = message.guild.channels.find('name', 'logs')

        if (!logChannel) {
          message.reply({
            embed
          });
          // console.log(msg);
        } else if (logChannel) {
          logChannel.send({
            embed
          });
        }

        return Con.close();
      });

    } else {
      message.author.send(error.noGuild);
    }
  }
}
