const error = require('../storage/messages.json')
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.guild) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message.reply(error.noPerm);
    } else {
      var member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if (!member)
        return message.reply(' Please mention a valid member of this server');
      if (!member.kickable)
        return message.reply(' I cannot kick this user! Do they have a higher role? Do I have kick permissions?');

      // slice(1) removes the first part, which here should be the user mention or ID
      // join(' ') takes all the various parts to make it a single string.
      let reason = args.slice(1).join(' ');
      if (!reason) reason = "No reason provided";

      let kickEmbed = new Discord.RichEmbed()
        .setDescription("~ Kick ~")
        .setColor("#e56b00")
        .addField("Kicked User", `${member} with ID ${member.id}`)
        .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
        .addField("Kicked In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);


      // Now, time for a swift kick in the nuts!
      await member.kick(reason)
        .catch(error => message.channel.send(` Sorry ${message.author} I couldn't kick because of : ${error}`));

      var logChannel = message.guild.channels.find('name', 'logs')

      if (!logChannel) {
        message.channel.send(kickEmbed);
      } else if (logChannel) {
        logChannel.send(kickEmbed);
      }

    }
  } else {
    message.author.send(error.noGuild);
  }

}
