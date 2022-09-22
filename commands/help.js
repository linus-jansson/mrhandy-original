const Discord = require("discord.js");
const Database = require('../classes/database');

exports.run = async (client, message, args, command) => { // eslint-disable-line no-unused-vars

  if (args[0]) {
    return searchForCommand(args.slice(0).join(' '));
  } else {
    return allcmds();
  }

  async function searchForCommand(args) {

    var Con = new Database();

    var count = 0;
    var prefix = "+";
    var log = -1;
    var meddelandet = "Could not get command message";

    if (message.guild) {
      await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${message.guild.id}'`).then(rows => {
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

    await Con.query(`SELECT COUNT(1) AS N FROM commands WHERE namn='${args}'`).then(rows => {
      count = parseInt(rows[0].N);
      if (0 === count) {
        if (message.guild) {
          message.channel.send("That Command does not exist..");
        } else {
          message.author.send("That Command does not exist..");
        }
      } else {
        Con.query(`SELECT * FROM commands WHERE namn='${args}'`).then(rows => {
          var commandName = rows[0].namn;
          var commandGroup = rows[0].grupp;
          var commandDesc = rows[0].beskrivning;
          var commandUsage = rows[0].anvandning;
          var meddelandet = "|`Command: "  + commandName + "`" +
          "\n|`Group: " + commandGroup + "`" +
          "\n|`Description: " + commandDesc + "`" +
          "\n|`Usage: " + prefix + commandUsage + "`" +
          " \n```Markdown\n# [] means required, <> means optional```";
          if (message.guild) {
            message.channel.send(meddelandet);
          } else {
            message.author.send(meddelandet);
          }
        });
      }
      Con.close();
    });
  }

  function allcmds() {

    var Con = new Database();
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

    Con.query("SELECT (select count(1) from commands) AS N,grupp, CONCAT('`',GROUP_CONCAT(namn SEPARATOR '` `'),'`') AS namnlista FROM commands GROUP BY grupp").then(rows => {

      var meddelandet = "```css\n" +
        "Showing " + rows[0].N + " commands - [] means required, <> means optional```\n";
      for (var i = 0; i < rows.length; i++) {
        meddelandet += "**" + (i+1) + ". " + rows[i].grupp + " -** " + rows[i].namnlista + "\n";
      }
      meddelandet += "```Markdown\n" +
        "#Do " + prefix + "help [command] to get information about how to use the command, ex: " + prefix + "help info\n" +
        "\n" +
        "```";

      if (message.guild) {
        message.channel.send(meddelandet);
      } else {
        message.author.send(meddelandet);
      }

     Con.close();
    });

  }


}
