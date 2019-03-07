const Http = require('./http.js');

class Auth {

  constructor() {
    this.http = new Http();
  }

  login(user) {
    return new Promise(resolve => {
      this.http.post(
        this.config.domain + '/idp/auth',
        {
          'username': user
        }
      ).then(data => {
        const SAMLResponse = data.body.split(samlInputStart)[1].split(samlInputEnd)[0].replace(`"`,``).trim();
  
        this.http.post(
          this.config.domain + '/auth/consume',
          {
            'SAMLResponse': SAMLResponse,
            'relaystate': ''
          }
        ).then(data => {
          this._session_id = data.headers['set-cookie'].find(cookie => cookie.indexOf('_session_id') > -1);
          console.log('Successfully logged in as: ' + user + ', _session_id: ' + this._session_id);
          resolve(this._session_id);
        });
      });
    });
  }

  getUser(path) {
    path = path.split('/');
    console.log(path);
    return path[1];
  }
}

module.exports = Auth;
