const error = require('../storage/messages.json')
exports.run = async (client, message, args, command) => { // eslint-disable-line no-unused-vars
  if (message.guild) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply(error.noPerm);
    } else {
      // get the delete count, as an actual number.
      const deleteCount = parseInt(args[0], 10);

      // Ooooh nice, combined conditions. <3
      if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply('Please provide a **number** between 2 and 100 for the number of messages to delete');

      // So we get our messages, and delete them. Simple enough, right?
      var fetched = await message.channel.fetchMessages({
        limit: deleteCount
      });
      message.channel.bulkDelete(fetched)
        .catch(error => message.reply(` Couldn't delete messages because of: ${error}`));
    }

  } else {
    message.author.send(error.noGuild);
  }

}
