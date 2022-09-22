const Discord = require("discord.js");
exports.run = async (client, message, args, command) => { // eslint-disable-line no-unused-vars

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  var getRandomColor = randomColor();

  //  console.log('User ' + message.author.tag + ' asked to see their profile!');
  if (args[0]) {
    if (message.guild) {
      var member = message.mentions.users.first();
      if (!member) message.reply("please write a valid user");
      else if(member) {
        const profileEmbed = new Discord.RichEmbed()
          .setDescription("User information")
          .setTitle(`${member.username}'s  profile`)
          .setColor(getRandomColor)
          .addField("Registration date", member.createdAt)
          .addField("Username", member.tag)
          .setThumbnail(member.avatarURL);

        return message.channel.send(profileEmbed)
      } else {
        message.reply("hmm")
      }
    } else {
      message.reply(error.noGuild);
    }
  } else {
    const profileEmbed = new Discord.RichEmbed()
      .setDescription("User information")
      .setTitle(`${message.author.username}'s  profile`)
      .setColor(getRandomColor)
      .addField("Registration date", message.author.createdAt)
      .addField("Username", message.author.tag)
      .setThumbnail(message.author.avatarURL);

    return message.channel.send(profileEmbed)
  }
}
