const express = require('express');
const history = require('connect-history-api-fallback');
const logger = require('morgan');

const port = process.env.PORT || 80;
console.log('Colibri configured for port ' + port);

const expressServer = express();

expressServer.use(logger('dev'));

const staticFileMiddleware = express.static('dist');
expressServer.use(staticFileMiddleware); // 1st call for unredirected requests
expressServer.use(history({ index: '/dist/index.html' }));
expressServer.use(staticFileMiddleware); // 2nd call for redirected requests

expressServer.listen(port, function() {
  console.log('Starting Colibri on port ' + port);
});
