const snekfetch = require("snekfetch");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  snekfetch.get('http://aws.random.cat/meow').then(response => {
        message.reply({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[2]}.jpg`}]});
        message.reply("This feature will be removed soon.")
        console.log('random cat picture was summond by ' +  message.author.username);
       }).catch(function(error) {
           console.log(" "+error);
           message.reply("Something went wrong while summoning the cat picture. Try again later!")
       });
}
