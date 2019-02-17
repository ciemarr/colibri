const express = require('express');
const history = require('connect-history-api-fallback');

const port = process.env.PORT || 80;

const app = express();

const staticFileMiddleware = express.static('dist');
app.use(staticFileMiddleware); // 1st call for unredirected requests
app.use(history({ index: '/dist/index.html' }));
app.use(staticFileMiddleware); // 2nd call for redirected requests

app.listen(port, function() { console.log('Starting Colibri on port ' + port)});
