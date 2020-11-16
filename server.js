const http = require('http');
const express = require('express');
const app = express();
var path = require('path');

app.use('/assets', express.static('assets'));
app.use('/views', express.static('views'));
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
http.createServer(app).listen(3000, () => console.log('Web server listening on port 3000'));
