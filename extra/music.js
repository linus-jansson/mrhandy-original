const Discord = require("discord.js");

const ytdl = require("ytdl-core");
const request = require("request");
const fs = require("fs");
const getYoutubeID = require("get-youtube-id");
const fetchvideoInfo = require("youtube-info");

const client = new Discord.Client();


var config = JSON.parse(fs.readFileSync('./auth.json', 'utf-8'));

const yt_api_key = config.yt_api_key;
const bot_controller = config.bot_controller;
const prefix = config.prefix;
const token = config.token;

var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];

client.login(token);

client.on('message', function(message){
  const member = message.member;
  const cmd = message.content.toLowerCase();
  const args = message.content.split(' ').slice(1).join("");

  if (cmd.startsWith(prefix + "play")) {
    if (queue.lenth > 0 || isPlaying) {
      getID(args, function(id){
        add_to_queue(id);
        fetchvideoInfo(id, function(err, videoInfo){
          if (err) throw new Error(err);
          message.reply("added to queue **" + videoInfo.title + "**");
          console.log("added to queue **" + videoInfo.title + "**");
        });
      });
    } else {
      isPlaying = true;
      getID(args, function(id){
        queue.push("placeholder");
        playMusic(id, message);
        fetchvideoInfo(id, function(err, videoInfo){
          if (err) throw new Error(err);
          message.reply("Now playing **" + videoInfo.title + "** ");
          console.log("Now playing **" + videoInfo.title + "** ");
        });
      })
    }
  }


});

client.on('ready', function() {
   console.log("The music script is ready and running");
});

function playMusic(id, message) {
  voiceChannel = message.member.voiceChannel;
  console.log("Trying to join Channel")

  voiceChannel.join().then(function (connection){
    stream = ytdl("https://www.youtube.com/watch?v=" + id, {
      filter: "audioonly"
    });
    skipReq = 0;
    skippers = [];
    console.log("Ready, to play music")
    dispatcher = connection.playStream(stream);
  });
}

function getID(str, cb){
  if (isYoutube(str)) {
    cb(getYoutubeID(str));
  }else {
    search_video(str, function (id){
      cb(id);
    });
  }
}

function add_to_queue(strID) {
  if (isYoutube(strID)) {
    queue.push(getYoutubeID(strID));
  }else {
    queue.push(strID);
  }
}
function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);
        if (!json.items[0]) callback("3_-a9nVZYjk");
        else {
            callback(json.items[0].id.videoId);
        }
    });
}

function isYoutube(str){
  return str.toLowerCase().indexOf("youtube.com") > -1;
}
