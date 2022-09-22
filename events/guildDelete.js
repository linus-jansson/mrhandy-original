const mysql = require('mysql');
const Database = require('../classes/database');

exports.run = (client, ...args) => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${args[0].name} (id: ${args[0].id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers!`);

  deleteFromDb(args[0].id);

  function deleteFromDb(guild_id) {
    var Con = new Database();
    Con.query(`DELETE FROM history WHERE guild_id = '${guild_id}'`).then( () => {
      console.log("Deleted History from database");
      return Con.query(`DELETE FROM settings WHERE guild_id = '${guild_id}'`);
    }).then( () => {
      console.log("Delted Settings from database");
      return Con.close();
    });
  }

};
