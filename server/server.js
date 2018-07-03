const express = require('express');
const RequestHandler = require('./request.handler.js');
let config = require('../../../mock.record.config.json');

class MockServer {

  constructor() {
    this.requestHandler = new RequestHandler(config);
    this.app = express();
  }

  start() {
    this.app.listen(config.port || 3000, () => console.log('Mock API running on port ' + config.port + '..'));
    this.app.use((req, res) => {
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
