const ms = require("ms");
const Discord = require("discord.js");
const error = require('../storage/messages.json')
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if ( message.guild ) {
    if(!message.member.hasPermission("MUTE_MEMBERS")) {
      return message.reply(error.noPerm);
    }
    else {

     //!tempmute @user 1s/m/h/d reson

    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("Couldn't find user.");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
    let muterole = message.guild.roles.find(`name`, "muted");
    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("You didn't specify a time!");

    let reason = args.slice(2).join(' ');
    if(!reason) reason = "No reason provided";

    let muteEmbed = new Discord.RichEmbed()
    .setDescription("~Mute~")
    .setColor("#bc0000")
    .addField("Muted User", `${tomute} with ID ${tomute.id}`)
    .addField("Muted By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Muted In", message.channel)
    .addField("Duration", mutetime)
    .addField("Reason", reason);

    let unMuteEmbed = new Discord.RichEmbed()
        .setDescription(`**Unmuted ${tomute}!**`)
        .setColor("#00ff00");

    await(tomute.addRole(muterole.id));

    var logChannel = message.guild.channels.find('name', 'logs')

    if (!logChannel) {
      message.channel.send(muteEmbed);

      setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.send(unMuteEmbed);
      }, ms(mutetime));
    } else if (logChannel) {
        logChannel.send(muteEmbed);
        setTimeout(function(){
          tomute.removeRole(muterole.id);
          logChannel.send(unMuteEmbed);
        }, ms(mutetime));
    }



    //end of module

    }

  }
  else {
    message.author.send(error.noGuild);
  }

}
