const SpotifyWebApi = require('spotify-web-api-node');
const token = 'BQCAQZkZIrOhcTxVYYoA7qdfuxHmfCuYsN9WnfIy6WBUWfzR26nIsmSSHUt-DMwkjjePgs_hwEHKfnYL0cMTxHvz3Ya1UXheFwTciIigmniQ9N65Suig3XPrfZh0zT22-ROcWM6RH2R_tBvMa4VWLeHCkV16GHRDQ85Th81wjO8PWINfzCjUGxCJkCNH6XTcRRQltWIFRNE_XtHUGb-Cow';

// Require the necessary discord.js classes
const { channelMention } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Client, Intents, MessageReaction } = require('discord.js');
const { dToken } = require('./config.json');
// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });


client.once('ready', () => {
	console.log('Running!');
});

client.on('messageCreate', (message) => { 
    if(message.content.startsWith('!')){
        if(message.content.substring(1) == 'spotfi' || message.content.substring(1) == 'Spotfi'){
            var rand = Math.floor(Math.random() * (tracks.length + 1));
        const quizEmbed = {
            color: 0x0099ff,
            title: tracks[rand].name,
            description: 'Who listens to this song???',
            url: (convertToString(JSON.stringify(tracks[rand].external_urls))),
            author: {
                name: tracks[rand].artists[0].name,
                icon_url:  '',
                url: tracks[rand].artists[0].external_urls.spotify,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Made by Ryfi',
                icon_url: 'https://i.scdn.co/image/ab6775700000ee85f7338c3e25e8cf840e3d3853',
            },
        };
        
        message.channel.send({ embeds: [quizEmbed] });
        }
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






const tracks = [];

const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    function getUser()
    {
        spotifyApi.getMe()
        .then(function(userData){
            getPlaylists(userData.body.id);
        })
    }

    async function getPlaylists(userId){
        spotifyApi.getUserPlaylists(userId)
        .then(async function(playlistData) {
            for (let playlist of playlistData.body.items){
                getTracks(playlist.id);
            }
        })
    }

    async function getTracks(playId){
        const data = await spotifyApi.getPlaylistTracks(playId, {
            offset: 1,
            limit: 100,
            fields: 'items'
          })
        
          for (let track_obj of data.body.items) {
            const track = track_obj.track
            tracks.push(track);
          }
        }

getUser();

/*for (let track of tracks.length){
    console.log(track.name);
}
*/
client.login(dToken);