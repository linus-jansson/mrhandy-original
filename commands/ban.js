const error = require('../storage/messages.json')
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if ( message.guild ) {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.hasPermission("BAN_MEMBERS")){
      return message.reply(error.noPerm);
    }
      else {
        if (message.guild.channels.exists('member-log', channel)) { //checks if there in an item in the channels collection that corresponds with the supplied parameters, returns a boolean
            message.reply(`The ${channel} channel already exists in this guild.`).catch(console.error);
            return; //prevents the rest of the code from being executed
        } else {
          message.guild.createChannel("logs",  "category")
          message.guild.createChannel(member-log, "text");
        }

        var member = message.mentions.members.first();
        if(!member)
          return message.reply(' Please mention a valid member of this server');
        if(!member.bannable)
          return message.reply(' I cannot ban this user! Do they have a higher role? Do I have kick permissions?');

        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";

        let banEmbed = new Discord.RichEmbed()
        .setDescription("~ Ban ~")
        .setColor("#bc0000")
        .addField("Banned User", `${member} with ID ${member.id}`)
        .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
        .addField("Banned In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

        await member.ban(reason)
          .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban because of : ${error}`));

        if (message.guild.id == '322015817627729921') {
          client.channels.get('465676073544318996').send(banEmbed);
        } else {
          message.channel.send(banEmbed);
        }

      }
    }
    else {
      message.author.send(error.noGuild);
    }

  }
