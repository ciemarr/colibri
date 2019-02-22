const express = require('express');
const history = require('connect-history-api-fallback');
const logger = require('morgan');
const path = require('path');

const port = process.env.PORT || 80;
console.log('Colibri configured for port ' + port);

const expressServer = express();

expressServer.use(logger('dev'));

expressServer.all("/api/:params", (req,res) => {
  res.send("api call");
});

expressServer.use('/service-worker.js', express.static('dist/service-worker.js'));
expressServer.use('/js', express.static('dist/js'));
expressServer.use('/img', express.static('dist/img'));
expressServer.use('/css', express.static('dist/css'));

expressServer.use('/*.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/', req.originalUrl));
});

expressServer.use((req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});

expressServer.use(history({ index: '/dist/index.html' }));

expressServer.listen(port, function() {
  console.log('Starting Colibri on port ' + port);
});
