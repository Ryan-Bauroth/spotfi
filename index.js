const fs = require('fs')
var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'af7b96e4abbc4f98943e5a9dbf839303',
  clientSecret: '940aaf4f9b2043cbaf3aa0eb3067b34e',
  redirectUri: 'http://localhost:8888/callback'
});

const token = 'BQDNsXLaxXHGfuFyJHRT3MUsc5YNd-2jrP8F_7wx44ptKCWH2flEn3oKmgDZtQpJ31TLtj-S9QJUlVuDwUU9YPhogrFCMo1blcpSQfBZ9BXlv2uh4YJdmyVlq46SuBnMjKeiEBec5vYYPxsjcJsvY-xrHbJJbHs7N_aFYzrRZe2CF3XnssFzdzpLd1jgbn9JGclFVc02QKudGLzMC11lHNBEyKUgwvQzD80kPXdkP7BfjU3TTB8z_E8j5_-I96TMGBTFY6bT8JoUqtirbxKUwGP9m-Dhdqp6iHBUquUNyCqt6oR8dD3JGRNQPpW0273MwpYWnrE3lN3tsDh1tgHy'
const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

const app = express();

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

