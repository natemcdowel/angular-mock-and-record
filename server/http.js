class Http {

  constructor(config) {
    this.config = config;
    this.http = require('request');
  }

  get(req) {

    return new Promise((resolve, reject) => {
      this.http.get(
      {
        json: true,
        url: this.config.domain + req.url,
        jar: true,
        headers: this.setRequestHeaders(req.headers)
      }, (error, response, body) => {

        if (error) {
          reject(error);
        }

        resolve({
          status: response.statusCode,
          body: response.body,
          headers: response.headers
        });

      });
    });
  }

  setRequestHeaders(requestHeaders) {
    let out = {};

    this.config.request_headers.forEach(header => {
      out[header] = requestHeaders[header];
    });

    return out;
  }

  setCorsHeaders(req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, x-xsrf-token');

    return res;
  }

  setResponseHeaders(headers, res) {
    for (let header in headers) {
      if (headers[header]) {
        res.header(header, headers[header]);
      }
    }

    return res;
  }
}

module.exports = Http;
