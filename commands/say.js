const error = require('../storage/messages.json')
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
 if (message.guild) {
   if(!message.member.hasPermission("ADMINISTRATOR"))
   {
     return message.reply(error.noPerm);
   }
     else {
       // makes the bot say something and delete the message. As an example, it's open to anyone to use.
       // To get the "message" itself we join the `args` back into a string with spaces:
       const sayMessage = args.join(" ");

       // And we get the bot to say the thing:
       message.channel.send(sayMessage);
     }
 }
 else {
  message.author.send(error.noGuild);
 }

}
