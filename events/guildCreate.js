const mysql = require('mysql');
const Database = require('../classes/database');
exports.run = (client, ...args) => {
    console.log(`New guild added the bot: ${args[0].name} (id: ${args[0].id}).`)
    console.log(`This server has ${args[0].memberCount} members!`)

    createRows(args[0].id, args[0].name);

    function createRows(guild_id, guild_name) {
      var Con = new Database();
      console.log(`Created rows for ${guild_name}`);
      Con.query(`REPLACE INTO settings(guild_id) VALUES('${guild_id}')`).then(rows => {
        return Con.close();
      });
    };

  };
