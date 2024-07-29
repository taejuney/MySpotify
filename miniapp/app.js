/*jshint strict:false */
/* jshint node: true */
/*jshint esversion: 8 */
/*global console*/

const music = require('./assets/json/music.json');
const photos = require('./assets/json/photos.json');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/photo-data', (req, res) => {
  res.json(photos);
});

app.get('/music-data', (req, res) => {
  res.json(music);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})