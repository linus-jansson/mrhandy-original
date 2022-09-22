const error = require('../storage/messages.json')
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.guild) {
    message.reply("The music feature is coming soon")
  } else {
    message.reply(error.noGuild)
  }


}
