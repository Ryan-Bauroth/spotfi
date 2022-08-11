const SpotifyWebApi = require('spotify-web-api-node');
const token = 'BQAYNzJ7uhFUSe-CdToLKTbUGEITN-RJCIgxs8n0IIjxgS_592HIkGq2Q7umQQfkAE1uuEWctjdtZFB8BD24PI7hiAraSc6U_DQrVHpidoue6Lj3s54QLqVKaagUPIt9LcdcEYgeNr3o7GdJr1mI1Ci04MosorQbw6xkNOQlDqX1MbFsBV64XFTfTIP4L02NCcdluQOYBlyGlFaH5a2njg';

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
            console.log(tracks[rand].name);
            console.log(tracks[rand].external_urls);

        const quizEmbed = {
            color: 0x0099ff,
            title: 'Who listens to this song???',
            description: tracks[rand].name,
            url: (tracks[rand].external_urls),
            /*author: {
                name: tracks[rand].artists[1],
                icon_url: tracks[rand].images,
                url: tracks[rand].external_urls,
            },
            */
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