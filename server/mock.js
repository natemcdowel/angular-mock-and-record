class Mock {

  constructor() {
    this.mockedRequests = {};
  }

  setRequestAsMocked(res, path, response) {
    this.mockedRequests[ path.replace('mock/', '') ] = JSON.parse(response);
  }

  clearMockedRequests() {
    this.mockedRequests = {};
  }
}

module.exports = Mock;
