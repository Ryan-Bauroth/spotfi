const SpotifyWebApi = require('spotify-web-api-node');
const token = 'BQASb7oUwaZGbtw8X6FLPnOtGeMbcXYS6OLyJ5aqUfLAd0sH_iUhSzzw2sAyuQTsFIuk5tSVutp30pKAAszjiHmQomvA97bnSKs6rwXRxMeYs9tiDM6sxS2Z4KG0hkfsJ3PUlzZzZUU3DUTFc96GG1Y1TQQWZq_JyahXBsWyntxB9wq6PBfateLyOERSkVqxxh1qwv7DAwG-KdY5kUJ_Sg';

// Require the necessary discord.js classes
const { Client, Intents, MessageReaction } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { dToken } = require('./config.json');
// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });


client.once('ready', () => {
	console.log('Running!');;
});

client.on('messageCreate', (message) => { 
    if(message.content.startsWith('!')){
        if(message.content.substring(1) == 'spotfi' || message.content.substring(1) == 'Spotfi'){
            var rand = Math.floor(Math.random() * (tracks.length + 1));
            if(tracks[rand].is_local == false){
        const quizEmbed = {
            color: 0x0099ff,
            title: 'Who listens to ' + tracks[rand].name + '?',
            url: (convertToString(JSON.stringify(tracks[rand].external_urls))),
            author: {
                name: tracks[rand].name + ' - ' + tracks[rand].artists[0].name,
                icon_url:  tracks[rand].album.images[0].url,
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
                text: 'Made by Ryfi',
                icon_url: 'https://i.scdn.co/image/ab6775700000ee85f7338c3e25e8cf840e3d3853',
            },
        };
        const quizAnswers = new MessageActionRow()
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
        message.channel.send({ embeds: [quizEmbed] , components: [quizAnswers] });
        }
    }
    }
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
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