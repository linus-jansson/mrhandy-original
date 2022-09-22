const error = require('../storage/messages.json')
exports.run = async (client, message, args, command) => {
  if (message.guild) {
    function makeChannel() {
      var server = message.guild;
      var content = args.slice(1).join('-');

      if (!content) {
        return message.reply("Name is required: +create channel [name]");
      } else {
        // "text" is for the type of channel that is want to be created
        if (message.guild.channels.exists('name', content)) {
          return message.reply(`The channel ${content} already exists`);
        } else {
          server.createChannel(content, "text");
          message.reply(`Channel ${content} was created`);
        }
      }

    }

    function removeChannel() {
      var content = args.slice(1).join('-');

      if (!content) {
        return message.reply("Name is required: +channel remove [name]");
      } else {
        if (!message.guild.channels.exists('name', content)) {
          return message.reply(`That channel does not exist`);
        } else {
          client.channels.find("name", content).delete()
          message.reply(`Channel ${content} was deleted`);
        }

      }
    }

    /* Själva kommandot*/
    if(!message.member.hasPermission("MANAGE_GUILD")){
      return message.reply(error.noPerm);
    } else {
      if (args[0] === "create") {
        makeChannel();
      } else if (args[0] === "remove") {
        removeChannel();
      } else {
        return message.reply("+channel [remove/create] [name]");
      }
    }
  } else {
    return message.reply(error.noGuild);
  }
}
