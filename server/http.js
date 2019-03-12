class Http {

  constructor(config) {
    this.config = config;
    this.http = require('request');
  }

  get(req, _session_id) {

    return new Promise((resolve, reject) => {
      let headers = this.setRequestHeaders(req.headers, _session_id);

      this.http.get(
      {
        json: true,
        jar: true,
        url: this.config.domain + req.url,
        headers: headers
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

  post(url, form) {
    return new Promise((resolve, reject) => {
      this.http.post(
      {
        url: url,
        jar: true,
        form: form,
      }, (error, response, body) => {
        if (response) {
          resolve({
            status: response.statusCode,
            body: response.body,
            headers: response.headers
          });
        } else {
          resolve();
        }

      });
    });
  }

  setRequestHeaders(requestHeaders, _session_id) {
    let out = {
      'cookie': _session_id
    };

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
