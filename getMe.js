const SpotifyWebApi = require('spotify-web-api-node');
const token = 'BQAAeWaPwdOr4c3VX0AjQYONC-DQqQhr7VXdmnOmADdwq8WWsN5K0M-8nierQKo-OjbIsfmLdR50T8cZ3lF62g87Ft7Qw8lqgXvxHxb5rJ-f58qkISyZREOoK9rojZe6l2jOhe-4PjRCfIURbbq_LVKT7vFYTpSTHerSPJ2et_MU_GZ60N3QmX1vyYzhf89AaIiZSxnhsXk9wSxeV_Rkaw';

// Require the necessary discord.js classes
const { Client, Intents, MessageReaction } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { dToken } = require('./config.json');
var fs = require('fs');
// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });


client.once('ready', async () => {
});

client.on('messageCreate', async (message) => { 
    if(message.content.startsWith('!')){
        if(message.content.substring(1) == 'spotfi' || message.content.substring(1) == 'Spotfi'){
            var rand = Math.floor(Math.random() * (tracks.length));
            if(tracks[rand].is_local == false && testFollowedUsers == true){
        const quizEmbed = {
            color: 0x0099ff,
            title: 'Guess who listens to ' + tracks[rand].name + '?',
            url: (convertToString(JSON.stringify(tracks[rand].external_urls))),
            author: {
                name: tracks[rand].name + ' - ' + tracks[rand].artists[0].name,
                icon_url: await getArtistImage(tracks[rand].artists[0].id),
                url: tracks[rand].artists[0].external_urls.spotify,
                //tracks[rand].artists[0].external_urls.spotify
                //(convertToString(JSON.stringify(tracks[rand].external_urls)))
                //tracks[rand].preview_url
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
        const quizButtons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('1')
					.setLabel('Name')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('2')
					.setLabel('Name')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('3')
					.setLabel('Name')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('4')
					.setLabel('Name')
					.setStyle('PRIMARY'),
			)
            .addComponents(
                new MessageButton()
                    .setURL(tracks[rand].preview_url)
                    .setLabel('Song Preview')
                    .setStyle('LINK')
            );
        message.channel.send({ embeds: [quizEmbed] , components: [quizButtons] });
        }
    }
    }
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
    if(interaction.customId == '1'){
        console.log('guess name one')
    }
    else if(interaction.customId == '2'){
        console.log('guess name two')
    }
    else if(interaction.customId == '3'){
        console.log('guess name three')
    }
    else if(interaction.customId == '4'){
        console.log('guess name four')
    }
});


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

/*
function testFollowedUsers(){
    //return true;
    console.log(userIds);
    var rand = Math.floor(Math.random() * (userIds.length));
    console.log(rand)
    spotifyApi.getUserPlaylists(userIds[rand])
    .then(async function (userPlayIds){
        console.log(userPlayIds);
        const data = await spotifyApi.getPlaylistTracks(userPlayIds)
        for(let userTracks of data.body.items){
            //console.log(userTracks);
        }
        
    })
}
*/
var tracks = [];

async function getUsers(){
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    return await getUser();
    async function getUser(){
        return await spotifyApi.getMe()
        .then(async function(userData){
            //console.log(await getPlaylists(userData.body.id));
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
            //console.log(track_obj.track)
          }
          return track;
        }
}
client.login(dToken);