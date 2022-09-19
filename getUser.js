const itoken = 'BQAKGNMUYNgtMjt6XyearkuCBQ8FyIt5Vtg-aYMKbLnYl0RSnz-SxFtVuwc8U6q_qYzOV7A2ePR8xu_QHHLQQ5Tg2V_Cv6MUknPCpNIVtmf9e0AgRHAcryCX7Pde9TGTaPcb5psKy7cq9fpTMU48D19eryhV4fmVypN6GMPGwOJHdYwmaTAHmZHB2cxdqMNU11ssLD4xQcd8hms3i-A-Uw';
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

async function printUsers(){
    var songArray = await getUsers();
    console.log(await spotifyApi.getAudioFeaturesForTrack(songArray[0][1].id));

}
/**
 * Function getUsers gets info about a user's songs and returns it
 * 
 * @inputs token of user
 * @returns array of tracks inside an array of playlists
 * @version 
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
printUsers();