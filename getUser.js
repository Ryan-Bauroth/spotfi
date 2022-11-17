const itoken = 'BQAumbbSbhLYyntjkxadC0RwwM1G94LYxp2b7MaTX6Mq_fxyCUuEePmuvJ-goKR0T63bLD8LDQPfzrPZI8DQhS2IRZPglLkMDpz9sG-Cs20DApjZPYzYx9aqrUvZVnSXBkq-9ZFMjkCy9KbreiDFG0pvU_osaLitTlUcP5N5p-LksYLAk7sf-TAztB1JyrNVLxh2xN5dKYziHfNzD6MrXw';
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi()
const dynamo = require('./dynamo');

// Require the necessary discord.js classes
const { Client, Intents, MessageReaction } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { dToken } = require('./config.json');
var fs = require('fs');
const { isTypedArray } = require('util/types');
// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });

var loadingArray = ["Surfing the interwebs", "Loading...", "Here we go: https://sptfy.com/LzyT", "Calculating...", "Please stand by", "My code is load", "Brown guilty eyes and little whilte lies", "Well, good for you, I guess you moved on really easily", "Oh girl I like you, I do (This is a loading message I'm not weird)", "Hey, I was doing just fine before I met you", "Put your hands up cause I won't"]
var tokens = ["BQCdUwr6peN5nduSghLAa3ByQX9LSkyHEbHmAXAw1VNwP60g7Cu0bC0RJejjfgqthn28C5G6F0ylDmaGWy-HBpw7weX5S3avIZcRI-A2EYGttbNrdPzqa4k1hRfVy0b36wFcAixy6OHXosaZqRKo3M24PhNh0D015PFIxybqmlJkAMzMN_kq174xFbsYG2pZC_O9viOefMZFk4oZK_R3lQ", null, null, null];
var usernameArray = ["NinjaPig", "Bobby", "Steve", "Theo"];
var idArray = [];
var buttonMsg;
var correctAnswer;
var correctUsers;
/**
 * Function getUsers()
 * @param {user token} token
 * @returns array of tracks inside an array of playlists
 */
async function getUsers(token){
    spotifyApi.setAccessToken(token);
    return getUser();
    function getUser(){
        return spotifyApi.getMe()
        .then(async function(userData){
            return await getPlaylists(userData.body.id);
        })
    }

    async function getPlaylists(userId){
        return spotifyApi.getUserPlaylists(userId)
        .then(async function(playlistData) {
            let playlistTracks = [];
            for (let playlist of playlistData.body.items){
            playlistTracks.push(await getTracks(playlist.id));
            //console.log(await getTracks(playlist.id))
        }
        return playlistTracks;
    })
    }

    async function getTracks(playId){
        const data = await spotifyApi.getPlaylistTracks(playId, {
            offset: 0,
            limit: 100,
            fields: 'items'
          })
          let track = [];
          for (let track_obj of data.body.items) {
            track.push(track_obj.track)
            //console.log(track_obj.track.name)
          }
          return track;
        }
}

client.on('messageCreate', async (message) => { 
  console.log(await dynamo.getUsers());
    if(message.content.startsWith('!')){
        if(message.content.substring(1) == 'spotfi' || message.content.substring(1) == 'Spotfi'){
          var trueId = false;
          for(let i = 0; i < idArray; i++){
            if(idArray[i]){
              trueId = true;
              break;
            }
          }
          if(trueId == true){
            let msg = await message.reply("*" + loadingArray[randomNumber(loadingArray.length)] +"*");
            let tracks = await trackArray(/*token*/itoken);
            var rand = randomNumber(tracks.length);
            if(tracks[rand].is_local == false){
                msg.delete();
                const quizEmbed = {
                    color: 0x0099ff,
                    title: 'Guess who listens to ' + tracks[rand].name + '?',
                    url: (convertToString(JSON.stringify(tracks[rand].external_urls))),
                    author: {
                        name: tracks[rand].name + ' - ' + tracks[rand].artists[0].name,
                        icon_url: await getArtistImage(tracks[rand].artists[0].id),
                        url: tracks[rand].artists[0].external_urls.spotify,
                    },
                    image: {
                        url: tracks[rand].album.images[0].url,
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Bot Made by Ryfi',
                        icon_url: 'https://i.scdn.co/image/ab6775700000ee85f7338c3e25e8cf840e3d3853',
                    },
                };
                let x = randomSelection(4, usernameArray)
                    switch(usernameArray[0]) {
                        case x[0]:
                          correctAnswer = 0;
                          break;
                        case x[1]:
                          correctAnswer = 1;
                          break;
                        case x[2]:
                          correctAnswer = 2;
                          break;
                        case x[3]:
                          correctAnswer = 3;
                          break;
                        default:
                            let y = randomNumber(4)
                            x[y] = usernameArray[0];
                            correctAnswer = y;
                    }
                const quizButtons = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('1')
                            .setLabel(x[0])
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('2')
                            .setLabel(x[1])
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('3')
                            .setLabel(x[2])
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('4')
                            .setLabel(x[3])
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setURL(tracks[rand].preview_url)
                            .setLabel('Song Preview')
                            .setStyle('LINK')
                    );
                    correctUsers = x;
                    buttonMsg = message.channel.send({ embeds: [quizEmbed] , components: [quizButtons] });
                
                }
            }
            else{
              message.reply("Looks like you haven't used spotfi before. Spotfi needs your spotify playlists to function correctly. If you want to use spotfi, you need to verify we are allowed to use your spotify data.")
            }
        }
    }
});
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
  if (interaction.customId == 'DELETE'){
    interaction.message.delete();
    return;
  }
    let x = [];
    if(interaction.customId == "1"){
      x = ["SUCCESS", "SECONDARY", "SECONDARY", "SECONDARY"];
            if(!correctAnswer == 0){
                x[0] = "DANGER";
            }
    }
    if(interaction.customId == "2"){
      x = ["SECONDARY", "SUCCESS", "SECONDARY", "SECONDARY"];
          if(!correctAnswer == 1){
            x[1] = "DANGER";
        }
    }
    if(interaction.customId == "3"){
      x = ["SECONDARY", "SECONDARY", "SUCCESS", "SECONDARY"];
          if(!correctAnswer == 2){
            x[2] = "DANGER";
        }
    }
    if(interaction.customId == "4"){
      x = ["SECONDARY", "SECONDARY", "SECONDARY", "SUCCESS"];
      if(!correctAnswer == 3){
        x[3] = "DANGER";
    }
    }
    x[correctAnswer] = "SUCCESS";
    const editedQuiz = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('1')
					.setLabel(correctUsers[0])
					.setStyle(x[0]),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('2')
					.setLabel(correctUsers[1])
					.setStyle(x[1]),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('3')
					.setLabel(correctUsers[2])
					.setStyle(x[2]),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('4')
					.setLabel(correctUsers[3])
					.setStyle(x[3]),
			)
      .addComponents(
				new MessageButton()
					.setCustomId('DELETE')
					.setLabel('Delete Message')
					.setStyle('PRIMARY'),
			);
            interaction.update({
                components: [editedQuiz]
              })
});

/**
 * Function trackNumber()
 * @param {user token} token 
 * @returns number of tracks user has in their playlists (does overlap)
 */
async function trackArray(token){
    let x = await getUsers(token);
    var y = [];
    for (let i = 0; i < x.length; i++){
        for (let w = 0; w < x[i].length; w++)
        y.push(x[i][w]);
    }
    return y;
}

function randomNumber(max){
    return Math.floor(Math.random() * (max));
}

function randomSelection(n, originalArray){
  let newArr = [];
  if (n >= originalArray.length) {
    return originalArray;
  }
  for (let i = 0; i < n; i++) {
    let newElem = originalArray[Math.floor(Math.random() * originalArray.length)];
    while (newArr.includes(newElem)) {
      newElem = originalArray[Math.floor(Math.random() * originalArray.length)];
    }
    newArr.push(newElem);
  }
  return newArr;
}

function convertToString(input){
    var splits = input.split(/("+)/);
    for (let i = 0; i < 6; i++){
        splits.shift()
    }
    splits.pop();
    splits.pop();
    var unsplit = splits.toString();
    unsplit.replace(/,/g,"");
    return unsplit;
}


function getArtistImage(id){
    return spotifyApi.getArtist(id)
    .then(function(artistData) {
        return artistData.body.images[0].url;
    })
}

client.login(dToken);