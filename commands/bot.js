const Discord = require("discord.js");
const error = require('../storage/messages.json');
// +Bot lock @user [reason]

exports.run = async (client, message, args, command) => { // eslint-disable-line no-unused-vars
  if (message.guild) {

    var botAccess = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    var botAccessRole = message.guild.roles.find(`name`, "botLock");
    var reason = args.slice(2).join(' ');

    if (!message.member.hasPermission("MUTE_MEMBERS")) {
      return message.reply(error.noPerm);
    } else {

      if (args[0] === "lock") {
        if (botAccess.roles.find("name", "botLock")) {
          return message.reply("That player is already locked")
        } else {

          if (!botAccess) return message.reply("Couldn't find user.");
          if (botAccess.hasPermission("ADMINISTRATOR")) return message.reply("Can't lock that user!");

          if (!botAccessRole) {
            try {
              botAccessRole = await message.guild.createRole({
                name: "botLock",
                color: "#000000",
                permissions: []
              })
              message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(botAccessRole, {
                  ADD_REACTIONS: true,
                });
              });

            } catch (e) {
              message.channel.send("Hmm.. Something went wrong.. Maybe I can't create roles?");
            }

          }
          return botAccess.addRole(botAccessRole).catch(console.error);

          if (!reason) reason = "No reason provided";

          let lockEmbed = new Discord.RichEmbed()
            .setDescription("~ Bot Lock ~")
            .setColor("#bc0000")
            .addField("Locked User", `${botAccess} with ID ${botAccess.id}`)
            .addField("Locked By", `<@${message.author.id}> with ID ${message.author.id}`)
            .addField("Locked In", message.channel)
            .addField("Time", message.createdAt)
            .addField("Reason", reason);

            var logChannel = message.guild.channels.find('name', 'logs');

            if (!logChannel) {
              message.channel.send(lockEmbed);
            } else {
              logChannel.send(lockEmbed);
            }
        }
      } else if (args[0] === "unlock") {
        if (!botAccess) return message.reply("Couldn't find user.");

        botAccess.removeRole(botAccessRole).catch(console.error);

        let unlockEmbed = new Discord.RichEmbed()
          .setDescription(`**Unclocked ${botAccess}!**`)
          .setColor("#00ff00");

          var logChannel = message.guild.channels.find('name', 'logs')

          if (!logChannel) {
            message.channel.send(unlockEmbed);
          } else if (logChannel) {
            logChannel.send(unlockEmbed);
          }
      }
    }
  } else {
    return message.reply(error.noGuild);
  }

}
