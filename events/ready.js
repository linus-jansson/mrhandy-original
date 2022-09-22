const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Database = require('../classes/database');
exports.run = (client, ...args) => {

  function setNewActivity(activity_num) {
    var grejer = [`Serving ${client.guilds.size} guilds!`, `+help | @me info`];
    client.user.setActivity(grejer[activity_num]);
    activity_num++;
    if (activity_num > grejer.length - 1) activity_num = 0;
    setTimeout(setNewActivity, 30000, activity_num);
  }
  console.log("======== Bot has started ========");
  console.log(`With ${client.users.size} users`);
  console.log(`In ${client.channels.size} channels`);
  console.log(`On ${client.guilds.size} servers`);
  console.log("Press ctrl + c or write exit To turn off!");
  console.log("=================================");

  setNewActivity(0);
  client.user.setUsername("Mr Handy");
};
