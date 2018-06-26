const express = require('express');
const RequestHandler = require('./request.handler.js');
const config = require('./config.json');

class MockServer {

  constructor() {
    this.requestHandler = new RequestHandler(config);
    this.app = express();
  }

  start() {
    this.app.listen(config.port || 3000, () => console.log('Mock API running on port ' + config.port + '..'));
    this.app.use((req, res) => {
      this.requestHandler.handle(req, res);
    });
  }
}

let server = new MockServer();
server.start();
