exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  console.log("Starting reload command by: " + message.author.tag);
  if( message.author.id !== '322015089529978880'){
    message.reply('You should not try to use that command. ');
    console.log("Someone that is not Linus just tried to reload me but did not have permisson: " + message.author.username + " on " + message.guild.name + "\n Will not continue with command.");

  }
    else {
        if( message.guild ) { message.reply(' please write this in our DM Linus.'); }
          else {
              message.author.send(' I will be back in a couple of seconds. If not please check the terminal <3 :) ');
              console.log("Good bye.");
              process.exit();
            }
    }
}
