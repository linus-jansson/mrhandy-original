exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if( message.guild ) {message.reply( ' A help message has been sent to you privately..');}

  message.author.send("`==================="+
                            "\nUser Commands:"+
                            "\n +ping = Will make the bot tell the ping"+
                            "\n +Profile = See your discord profile picture"+
                            "\n +help = To see this.."+
                            "\n +invite = To get some usefull links"+
                            "\n +serverinfo = Get some information about the server"+
                            "\n +cat = Get a random cute cat picture"+
                            "\n +music = Get the music commands"+
                            "\n===================`"+
                            "\n"+
                            "\n`==================="+
                            "\nAdmin commands:"+
                            "\n +ban @player [REASON] = ban the player"+
                            "\n +kick @player [REASON] = kick player from server"+
                            "\n +mute @player [TIME] [REASON] = Will mute a user temporarly"+
                            "\n +purge 2-100 = Will delete any messages sent from 2-100"+
                            "\n +last 1-25 = Will display 1-25 of the previous commands"+
                            "\n +say [TEXT] = Will make the bot say something and delete your message"+
                            "\n===================`"+
                            "\n**Please check out the developer of the bot's website: https://www.swedcraft.net**")

}
