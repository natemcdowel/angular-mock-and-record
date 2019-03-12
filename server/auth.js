const Http = require('./http.js');
const samlInputStart = '<input type="hidden" name="SAMLResponse" id="SAMLResponse" value=';
const samlInputEnd = ' />';

class Auth {

  constructor() {
    this.http = new Http();
    this._session_id = '';
  }

  login(user, domain) {
    return new Promise(resolve => {
      this.http.post(
        domain + '/idp/auth',
        {
          'username': user
        }
      ).then(data => {

        if (!data) {
          return resolve();
        }

        const SAMLResponse = data.body.split(samlInputStart)[1].split(samlInputEnd)[0].replace(`"`,``).trim();
        
        this.http.post(
          domain + '/auth/consume',
          {
            'SAMLResponse': SAMLResponse,
            'relaystate': ''
          }
        ).then(data => {
          this._session_id = data.headers['set-cookie'].find(cookie => cookie.indexOf('_session_id') > -1);
          console.log('Successfully logged in as: ' + user + ', _session_id: ' + this._session_id);
          resolve(this._session_id);
        }, () => {
          console.log('Error logging in!');
          resolve('');
        });
      });
    });
  }

  getUser(path) {
    path = path.split('/');
    return path[2];
  }
}

module.exports = Auth;
