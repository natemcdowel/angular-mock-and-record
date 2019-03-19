const Utilities = require('./utilities.js');

class Mock {

  constructor() {
    this.mockedRequests = {};
    this.utilities = new Utilities();
  }

  setRequestAsMocked(path, response, headers) {
    const strippedPath = path.replace('mock/', '') + (headers['mock-param'] ? '|' + headers['mock-param'] : '');

    this.mockedRequests[ strippedPath ] = {
      response: response,
      headers: headers
    };
  }

  clearMockedRequests() {
    this.mockedRequests = {};
  }

  hasRequestBeenMocked(matchedPath, matchedUrl) {
    let foundMock = this.mockedRequests[ matchedPath ];

    this.utilities.getParams(matchedUrl).forEach(param => {
      if (this.mockedRequests[ matchedPath + '|' + param ]) {
        foundMock = this.mockedRequests[ matchedPath + '|' + param ];
      }
    });

    return foundMock;
  }
}

module.exports = Mock;
