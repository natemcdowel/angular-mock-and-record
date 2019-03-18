class Mock {

  constructor() {
    this.mockedRequests = {};
  }

  setRequestAsMocked(path, response, headers) {
    this.mockedRequests[ path.replace('mock/', '') ] = {
      response: response,
      headers: headers
    };
  }

  clearMockedRequests() {
    this.mockedRequests = {};
  }
}

module.exports = Mock;
