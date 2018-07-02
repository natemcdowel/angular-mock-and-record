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
		var url = this.api_host + '/mock/' + endpoint + '?response=' + encodeURIComponent(JSON.stringify(mockResponse));
		var xmlHttp = new XMLHttpRequest();
		if (!method) {
			xmlHttp.open('GET', url, false);
		}
		else {
			xmlHttp.open(method, url, false);
		}
		xmlHttp.send(null);
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
