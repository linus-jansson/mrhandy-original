function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '0x';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

var getRandomColor = randomColor();

function CreateDbConn() {
  var con = mysql.createConnection({
    host: "xxx",
    port: 0000,
    user: "xxx",
    password: "xxx",
    database: "xxx"
  });
  return con;
}

function logCommand(guild_id, command, user) {
  var Con = CreateDbConn();
  Con.connect(function(err) {
    if (err) console.log(err);
    else {
      var sql = `INSERT INTO history(guild_id,command,user) VALUES('${guild_id}','${command}','${user}')`;
      Con.query(sql, function(err, result) {
        if (err) console.log(err);
      });
      purgeCommands(guild_id, Con);
    }
    Con.end();
  });
}

function purgeCommands(guild_id, connection) {
  var Con = CreateDbConn();
  Con.connect(function(err) {
    if (err) console.log(err);
    else {
      Con.query(`SELECT COUNT(1) AS 'N' FROM history WHERE guild_id='${guild_id}'`, function(err, result, fields) {
        if (err)
          console.log(err);
        else {
          if (result[0].N > 25) {
            Con.query(`DELETE FROM history WHERE guild_id='${guild_id}' AND logtime=(SELECT MIN(B.logtime) FROM (SELECT logtime FROM history WHERE guild_id='${guild_id}') AS B WHERE guild_id='${guild_id}') LIMIT 1`,
              function(e2, r2) {
                if (e2) console.log(e2);
                // else console.log(`Deleted one old command from guild id ${guild_id}.`)
              });
            purgeCommands(guild_id);
          }
        }
        Con.end();
      });
    }
  });
}

function helpGroups() {
  let groups = 'all\n';

  for (var cmd in commands) {
    if (!groups.includes(commands[cmd].group)) {
      groups += `${commands[cmd].group}\n`
    }
  }

  message.author.send({
    embed: {
      description: `**${groups}** `,
      title: "Groups",
      color: 0x1D82B6
    }
  })
}

function showAll() { //temporär tills buggen är fixad med invalid grej
  const embed = new Discord.RichEmbed()
    .setColor(0x1D82B6) // You can set this color to whatever you want.

  // Variables
  let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

  // Lets create the for loop that loops through the commands
  for (var cmd in commands) { // We should start creating the commands json first.
    // Checks if the group is "users" - and replace type with group
    if (commands[cmd]) {
      // Lets also count commandsFound + 1 every time it finds a command in the group
      commandsFound++
      // Lets add the command field to the embed
      // console.log(commands[cmd].name);

      embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${config.prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
    }
  }

  // Add some more to the embed - we need to move that out of the for loop.
  embed.addBlankField(true)
  embed.setFooter(`Currently showing all commands. To view another group do ${config.prefix}help [group / command]`)
  embed.setDescription(`**${commandsFound} commands found** - [] means required, <> means optional`)

  message.author.send({
    embed
  })
}

function helpMessage() {

  // Let's test this! - We have a few bugs first though.
  // Turns out you can only use the word embed to define embeds.
  if (args.join(" ").toUpperCase() === 'USER') {

    // Start of the embed
    const embed = new Discord.RichEmbed()
      .setColor(0x1D82B6) // You can set this color to whatever you want.

    // Variables
    let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

    // Lets create the for loop that loops through the commands
    for (var cmd in commands) { // We should start creating the commands json first.
      // Checks if the group is "users" - and replace type with group
      if (commands[cmd].group.toUpperCase() === 'USER') {
        // Lets also count commandsFound + 1 every time it finds a command in the group
        commandsFound++
        // Lets add the command field to the embed
        // console.log(commands[cmd].name);

        // embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${config.prefix + commands[cmd].usage}`);
        // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
      }
    }

    // Add some more to the embed - we need to move that out of the for loop.
    embed.addBlankField(true)
    embed.setFooter(`Currently showing user commands. To view another group do ${config.prefix}help [group / command]`)
    embed.setDescription(`**${commandsFound} commands found** - [] means required, <> means optional`)

    message.author.send({
      embed
    })


  } else if (args.join(" ").toUpperCase() === 'ADMIN') {
    // Start of the embed
    const embed = new Discord.RichEmbed()
      .setColor(0x1D82B6) // You can set this color to whatever you want.

    // Variables
    let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

    // Lets create the for loop that loops through the commands
    for (var cmd in commands) { // We should start creating the commands json first.
      // Checks if the group is "users" - and replace type with group
      if (commands[cmd].group.toUpperCase() === 'ADMIN') {
        // Lets also count commandsFound + 1 every time it finds a command in the group
        commandsFound++
        // Lets add the command field to the embed
        // console.log(commands[cmd].name);
        embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${config.prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
      }
    }

    // Add some more to the embed - we need to move that out of the for loop.
    embed.addBlankField(true)
    embed.setFooter(`Currently showing user commands. To view another group do ${config.prefix}help [group / command]`)
    embed.setDescription(`**${commandsFound} commands found** - [] means required, <> means optional`)

    message.author.send({
      embed
    })
  } else if (args.join(" ").toUpperCase() === 'ALL') {
    // Start of the embed
    const embed = new Discord.RichEmbed()
      .setColor(0x1D82B6) // You can set this color to whatever you want.

    // Variables
    let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

    // Lets create the for loop that loops through the commands
    for (var cmd in commands) { // We should start creating the commands json first.
      // Checks if the group is "users" - and replace type with group
      if (commands[cmd]) {
        // Lets also count commandsFound + 1 every time it finds a command in the group
        commandsFound++
        // Lets add the command field to the embed
        // console.log(commands[cmd].name);

        embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${config.prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
      }
    }

    // Add some more to the embed - we need to move that out of the for loop.
    embed.addBlankField(true)
    embed.setFooter(`Currently showing all commands. To view another group do ${config.prefix}help [group / command]`)
    embed.setDescription(`**${commandsFound} commands found** - [] means required, <> means optional`)

    message.author.send({
      embed
    })
  } else {
    // Now, lets do something when they do ~help [cmd / group] - You can use copy and paste for a lot of this part.

    // Variables
    let groupFound = '';

    for (var cmd in commands) { // This will see if their is a group named after what the user entered.

      if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
        groupFound = commands[cmd].group.toUpperCase(); // Lets set the ground found, then break out of the loop.
        break;
      }

    }

    if (groupFound != '') { // If a group is found, run this statement.

      // Start of the embed
      const embed = new Discord.RichEmbed()
        .setColor(0x1D82B6) // You can set this color to whatever you want.

      // Variables
      let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.


      for (var cmd in commands) { // We can use copy and paste again

        // Checks if the group is "users" - and replace type with group
        if (commands[cmd].group.toUpperCase() === groupFound) {
          // Lets also count commandsFound + 1 every time it finds a command in the group
          commandsFound++
          // Lets add the command field to the embed

          embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${config.prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
        }

      }

      // Add some more to the embed - we need to move that out of the for loop.
      embed.setFooter(`Currently showing ${groupFound} commands. To view another group do ${config.prefix}help [group / command]`)
      embed.setDescription(`**${commandsFound} commands found** - [] means required, <> means optional`)

      if (message.guild) {
        // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
        message.author.send({
          embed
        })

        // Post in chat they sent to DMs
        message.channel.send({
          embed: {
            color: 0x1D82B6,
            description: `**Check your DMs ${message.author}!**`
          }
        })
      } else {
        message.author.send({
          embed
        })
      }

      // Make sure you copy and paste into the right place, lets test it now!
      return; // We want to make sure we return so it doesnt run the rest of the script after it finds a group! Lets test it!

      // Now lets show groups.
    }

    // Although, if a group is not found, lets see if it is a command

    // Variables
    let commandFound = '';
    let commandDesc = '';
    let commandUsage = '';
    let commandGroup = '';

    for (var cmd in commands) { // Copy and paste

      if (args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
        commandFound = commands[cmd].name; // Lets change this so it doesnt make it go uppcase
        commandDesc = commands[cmd].desc;
        commandUsage = commands[cmd].usage;
        commandGroup = commands[cmd].group;
        break;
      }

    }

    // Lets post in chat if nothing is found!
    /*if (commandFound === '') {
        message.channel.send({embed: {
            description:`**No group or command found titled \`${args.join(" ")}\`**`,
            color: 0x1D82B6,
        }})

    } */

    // Since this one is smaller, lets send the embed differently.
    message.author.send({
      embed: {
        title: '[] means required, <> means optional',
        color: 0x1D82B6,
        fields: [{
          name: commandFound,
          value: `**Description:** ${commandDesc}\n**Usage:** ${commandUsage}\n**Group:** ${commandGroup}`
        }]
      }
    })

    return; // We want to return here so that it doesnt run the rest of the script also.
  }
}
