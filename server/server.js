const express = require('express');
const bodyParser = require("body-parser");
const RequestHandler = require('./request.handler.js');
let config = require('../../../mock.record.config.json');

class MockServer {

  constructor() {
    this.requestHandler = new RequestHandler(config);
    this.app = express();
    this.app.use( bodyParser.json() );
    this.app.use( bodyParser.urlencoded({extended: true}) ); 
  }

  start() {
    this.app.listen(config.port || 3000, () => console.log('Mock API running on port ' + config.port + '..'));
    this.app.all('*', (req, res) => {
      req.url = this.rewritePathToMocks(req.url);
      this.requestHandler.handle(req, res);
    });
  }

  rewritePathToMocks(url) {
    return url.replace(config.proxied_mock_server_route, '');
  }
}

let server = new MockServer();
server.start();
