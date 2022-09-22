const Discord = require('discord.js')
const config = require('./auth.json')
const ms = require('ms')
const fs = require('fs')
const mysql = require('mysql')

const error = require('./storage/messages.json')
const Database = require('./classes/database')

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

rl.on('line', (input) => {
  // console.log(`Received: ${input}`);
  if (input === "stats") {
    console.log("======== Bot Information ========");
    console.log(`With ${client.users.size} users`);
    console.log(`In ${client.channels.size} channels`);
    console.log(`On ${client.guilds.size} servers`);
    console.log("=================================");
  } else if (input === "exit") {
    console.log("Turning off bot. If you use while true the bot will start again. ");
    process.exit();
  }
});

const client = new Discord.Client();

// client.on("error", (e) => console.error(e));
// client.on("warn", (e) => console.warn(e));
// client.on("debug", (e) => console.info(e));

client.login(config.token);

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", async message => {

  if (message.author.bot) return;

  if (!message.guild) {
    var prefix = "+";
  }
  if (message.guild) {
    var prefix = await getPrefix(message.guild.id);
  }

  if (message.content.indexOf(prefix) !== 0) {
    spamProtection();
  } else {
    spamProtection();
  }


  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${prefix})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const command = args.shift();

  async function spamProtection() {
    if (message.guild) {
      var protect = await getServerProtect(message.guild.id);
      var isUrl = new RegExp(/(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+/gm).test(message.content);
      var isYoutubeLink = new RegExp(/((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/).test(message.content);
      var isSocialMediaLink = new RegExp(/((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be|soundcloud.com|spotify.com))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/).test(message.content);
      var isDiscordLink = new RegExp(/((https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z])/).test(message.content);
      var is9gagLink;
      // new RegExp(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/);
      // new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9-A-Z]+([\-\.]{1}[a-z0-9-A-Z]+)*\.[A-Za-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm)
      if (protect == 0) {
        return;
      } else if (protect == 1) {
        // checka ifall det är en länk över huvudtaget
        if (isUrl) {
          // cheka ifall det är en youtube link annars så är det en normal url
          if (isDiscordLink && !message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send("Please do not send discord links on this server");
            message.delete().catch(O_o=>{});
          } else  {
            return;
          }

        // else if det inte är en länk Return;
        } else if (!isUrl) {
          return;
        } else {
          return;
        }

      } else {
        console.log("Got log " + protect + " from database");
      }
    }
  }



  // INSERT INTO settings(id,log,prefix) VALUES('some_id',0,'+');
  // UPDATE settings SET log=0 WHERE id='some_id' LIMIT 1;
  // UPDATE settings SET log=1 WHERE id='some_id' LIMIT 1;
  // UPDATE settings SET prefix='€' WHERE id='some_id' LIMIT 1;
  // SELECT log FROM settings WHERE guild_id='some_id';

  function getCommands() {
    try {
      if (fs.existsSync(`./commands/${command}.js`)) {

        let commandFile = require(`./commands/${command}.js`);

        message.delete().catch(O_o => {});
        commandFile.run(client, message, args, command);
      } else {
        message.react(`❌`);
      }

    } catch (err) {
      message.reply(error.someWrong)
      console.error(err);
    }
  }

  if (message.guild && message.author) logCommand(message.guild.id, command, message.author.tag);

  if (message.guild) {
    if (message.member.roles.find("name", "botLock")) {
      return message.reply("You are bot locked to use my commands.")
    } else {
      getCommands();
    }
  } else {
    getCommands();
  }


});

async function getPrefix(guild_id) {
  var Con = new Database();
  var count = 0;
  var prefix = "+";
  await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
    count = parseInt(rows[0].N);
    if (0 == count)
      return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
        return Con.query(`SELECT prefix FROM settings WHERE guild_id='${guild_id}'`);
      });
    else
      return Con.query(`SELECT prefix FROM settings WHERE guild_id='${guild_id}'`);
  }).then(rows => {
    prefix = rows[0].prefix;
    //  console.log("Got prefix " + prefix + " from database");
    return Con.close();
  });
  return prefix;
}

async function setPrefix(guild_id, prefix) {
  var Con = new Database();
  Con.query(`UPDATE settings SET prefix='${prefix}' WHERE guild_id='${guild_id}'`).then(rows => {
    console.log(`Set log ${prefix}`);
  }).then(rows => Con.close());
}

function logCommand(guild_id, command, user) {
  var Con = new Database();
  Con.query(`INSERT INTO history(guild_id,command,user) VALUES('${guild_id}','${command}','${user}')`).then(rows => {
    purgeCommands(guild_id, Con);
    return Con.close();
  });
}

function purgeCommands(guild_id, connection) {
  var Con = new Database();
  Con.query(`SELECT COUNT(1) AS 'N' FROM history WHERE guild_id='${guild_id}'`).then(rows => {
    if (rows[0].N > 25) {
      Con.query(`DELETE FROM history WHERE guild_id='${guild_id}' AND logtime=(SELECT MIN(B.logtime) FROM (SELECT logtime FROM history WHERE guild_id='${guild_id}') AS B WHERE guild_id='${guild_id}') LIMIT 1`,
        function(e2, r2) {
          if (e2) console.log(e2);
        });
      purgeCommands(guild_id);
      return Con.close();
    }
  });
}

async function getServerProtect(guild_id) {
  var Con = new Database();
  var count = 0;
  var protect = -1;
  await Con.query(`SELECT COUNT(1) AS N FROM settings WHERE guild_id='${guild_id}'`).then(rows => {
    count = parseInt(rows[0].N);
    if (0 == count)
      return Con.query(`INSERT INTO settings(guild_id) VALUES('${guild_id}')`).then(() => {
        return Con.query(`SELECT spamprotection FROM settings WHERE guild_id='${guild_id}'`);
      });
    else
      return Con.query(`SELECT spamprotection FROM settings WHERE guild_id='${guild_id}'`);
  }).then(rows => {
    protect = parseInt(rows[0].spamprotection);
    //console.log("Got log "+log+" from database");
    return Con.close();
  });
  return protect;
}
