import { browser } from 'protractor';
import { XMLHttpRequest } from 'xmlhttprequest';
// let appConfigData = require('../../config/app.config.json');

export class MockUtilities {
  api_host = 'http://localhost:3000'; //appConfigData.api_host || 'http://localhost:3000';

  mockRequest(endpoint, mockResponse, method) {
    browser.executeScript( this.getMockRequest(endpoint, mockResponse) );
  }

  getMockRequest(endpoint, mockResponse, method?) {
    const url = this.api_host + '/mock/' + endpoint + '?response=' + encodeURIComponent(JSON.stringify(mockResponse));

    let xmlHttp = new XMLHttpRequest();
    if (!method) {
      xmlHttp.open( 'GET', url, false );
    } else {
      xmlHttp.open( method , url, false );
    }
    xmlHttp.send( null );

    return xmlHttp.responseText;
  }

  clearMocks() {
    browser.executeScript( this.clearMockRequest() );
  }

  clearMockRequest() {
    const url = this.api_host + '/clear';

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( 'GET', url, false );
    xmlHttp.send( null );

    return xmlHttp.responseText;
  }
}
