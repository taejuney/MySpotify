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
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
});

// just trying to show that you can render/return the same HTML file (index.html) in this case from multiple routes
app.get('/sample', function (req, res) {
  res.render('index.html');
});

app.get('/my-spotify', function (req, res) {
  res.render('p4.html'); //the servers looks in the views directory (by default) for the p4.html file
});

app.get('/photo-data', (req, res) => {
  res.json(photos);
});

app.get('/music-data', (req, res) => {
  res.json(music);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})