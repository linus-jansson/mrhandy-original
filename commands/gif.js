const Discord = require("discord.js");
const got = require("got");
const api = require("../auth.json");

exports.run = async (client, message, args, command) => { // eslint-disable-line no-unused-vars

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  var getRandomColor = randomColor();

  if (args.length < 1) return message.channel.send(`Choose some category to show`, {
    code: "py"
  })
  const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${api.giphy_api_key}&tag=${encodeURIComponent(args.join(" "))}`, {
    json: true
  })
  if (!res || !res.body || !res.body.data) return message.channel.send("@Failed to find a gif that matched your query!", {
    code: py
  })

  const gifEmbed = new Discord.RichEmbed()
  .setImage(res.body.data.image_url)
  .setColor(getRandomColor);
  .setAuthor(message.author.tag, message.author.displayAvatarURL);

  message.channel.send({
    embed: gifEmbed
  })
}
