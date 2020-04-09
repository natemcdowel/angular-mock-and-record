const Http = require('./http.js');
const samlInputStart = '<input type="hidden" name="SAMLResponse" id="SAMLResponse" value=';
const samlInputEnd = ' />';

class Auth {

  constructor() {
    this.http = new Http();
    this._session_id = '';
    this._domain = '';
    this.sessionIdCookieName = '_platform-api-endpoints_session';
    this.sessionIdCookieNameFallback = '_session_id';
    this.sessionKeepAliveEndpoint = '/auth/hasSession.json';
    this.sessionKeepAliveInterval = 20;
    this.sessionKeepAliveTimer = null;
  }

  login(user, domain, keepAlive = true) {
    return new Promise(resolve => {
      this.http.post(
        domain + '/idp/auth',
        {
          'username': user
        }
      ).then(data => {

        if (!(data && data.body)) {
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
          this._session_id = data.headers['set-cookie'].find(cookie => cookie.indexOf(this.sessionIdCookieName) > -1);
          if (!this._session_id) {
            this._session_id = data.headers['set-cookie'].find(cookie => cookie.indexOf(this.sessionIdCookieNameFallback) > -1);
          }
          if (!this._session_id) {
            console.log('ERROR: Session ID Cookie not found: ', data.headers['set-cookie']);
          }
          console.log('Successfully logged in as: ' + user + ', ' + this.sessionIdCookieName + ': ' + this._session_id);
          if (keepAlive) {
            this.http.config = {domain: domain};
            this.initKeepAlive();
          }
          resolve(this._session_id);
        }, () => {
          console.log('Error logging in!');
          resolve('');
        });
      });
    });
  }

  logout() {
    return new Promise(resolve => {
      if (this.sessionKeepAliveTimer) {
        clearTimeout(this.sessionKeepAliveTimer);
        this.sessionKeepAliveTimer = null;
      }
      this.http.get(
        {url: '/auth/SSOLogout?relaystate=http://localhost:4200'},
        this._session_id
      ).then(
        resp => {
          console.log('Successfully Logged Out');
          resolve();
        },
        () => resolve()
      );
    });
  }

  getUser(path) {
    path = path.split('/');
    return path[2];
  }

  setSessionIdCookieName(name) {
    this.sessionIdCookieName = name;
  }

  setSessionKeepAliveEndpoint(endpoint) {
    this.sessionKeepAliveEndpoint = endpoint;
  }

  setSessionKeepAliveInterval(interval) {
    this.sessionKeepAliveInterval = interval;
  }

  initKeepAlive() {
    this.http.get(
      {url: this.sessionKeepAliveEndpoint},
      this._session_id
    ).then((resp) => {
      const status = resp && resp.body && resp.body.data;
      if (status) {
        console.log('Session Keep-Alive Ping Successful: ', status);
        this.sessionKeepAliveTimer = setTimeout(() => this.initKeepAlive(), this.sessionKeepAliveInterval * 1000);
      } else {
        console.log('Error: Session Keep-Alive Ping Failed: ', resp);
      }
    });
  }
}

module.exports = Auth;
