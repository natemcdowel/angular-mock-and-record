Object.defineProperty(exports, "__esModule", { value: true });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var api_host;
try {
	api_host = require('../../../config/app.config.json').api_host;
}
catch (e) {
	api_host = 'http://localhost:3000';
}
var MockUtilities = /** @class */ (function () {
	function MockUtilities() {
		this.api_host = api_host;
	}
	MockUtilities.prototype.mockRequest = function (endpoint, mockResponse, method) {
		browser.executeScript(this.getMockRequest(endpoint, mockResponse));
	};
	MockUtilities.prototype.getMockRequest = function (endpoint, mockResponse, method) {
		var url = this.api_host + '/mock/' + endpoint;
		var xmlHttp = new XMLHttpRequest();
		if (!method) {
			xmlHttp.open('POST', url, false);
		}
		else {
			xmlHttp.open(method, url, false);
		}
		xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xmlHttp.send(JSON.stringify(mockResponse));
		return xmlHttp.responseText;
	};
	MockUtilities.prototype.clearMocks = function () {
		browser.executeScript(this.clearMockRequest());
	};
	MockUtilities.prototype.clearMockRequest = function () {
		var url = this.api_host + '/clear';
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', url, false);
		xmlHttp.send(null);
		return xmlHttp.responseText;
	};
	return MockUtilities;
}());
exports.MockUtilities = MockUtilities;
