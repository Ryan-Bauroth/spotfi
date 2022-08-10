const SpotifyWebApi = require('spotify-web-api-node');
const token = 'BQA0tJBZW1nrExDiyoM6CdA0E5-A02sqrNuep_QtQ-vBKJLgRMIt5R6uW5LwLCKJK3W_6KRvUUzkr_lfAxJdS7Mny0oVbQTpWPe8desNBQrDam80QxY3_bjs2AHvWsBzTTYlsrcUiZWhPzvaD5LmAXOX22fihxwuNhBpzLyRxRUUTNVoFksAcwwT_MGSLGHDsDcD6Ri6bMitexAIxM6tMg';

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