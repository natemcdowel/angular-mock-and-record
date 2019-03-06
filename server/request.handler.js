const Http = require('./http.js');
const Record = require('./record.js');
const Mock = require('./mock.js');
const Utilities = require('./utilities.js');

class RequestHandler {

  constructor(config) {
    this.config = config;
    this.http = new Http(this.config);
    this.recorder = new Record(this.config);
    this.mock = new Mock();
    this.utilities = new Utilities();
    this.login();
  }

  handle(req, res) {

    const matchedPath = this.utilities.matchPath(req.path);

    if (this.config.cors) {
      res = this.http.setCorsHeaders(req, res);
    }
  
    if (this.shouldMock(req.path)) {

      this.mock.setRequestAsMocked(res, req.path, req.body);
      res.status(200).send(true);

    } else if (this.shouldClearMocks(req.path)) {
  
      this.mock.clearMockedRequests();
      res.status(200).send(true);

    } else if (this.hasRequestBeenMocked(matchedPath)) {

      res.status(200).send(this.mock.mockedRequests[matchedPath]);

    } else {

      this.checkTapesForRecording(res, req, this.config.tape_name);

    }
  }

  checkTapesForRecording(res, req, tapeToCheck) {
    let recording = this.recorder.findRecording(req, tapeToCheck);

    if (recording) {

      this.sendResponse(recording, res);

    } else {

      if (!this.recordingAllowed()) {
        console.error('\nAn unrecorded request was detected:\n' + req.url);
        console.error('\nTo record new requests, use the `allow_recording` parameter\n');
        process.exit(1);
      }

      this.http.get(req).then(data => {

        this.sendResponse(data, res);
        data.mock_request_url = req.url;
        this.recorder.recordTape(data, req.path, tapeToCheck);
        console.log('\nRecorded request:  ' + req.url + '\n');

      });

    }
  }

  sendResponse(data, res) {
    res = this.http.setResponseHeaders(data.headers, res);
    res.status(data.status).send(data.body);
  }

  recordingAllowed() {
    return !!( this.config.allow_recording || process.argv[2] === 'allow_recording' );
  }

  hasRequestBeenMocked(matchedPath) {
    return this.mock.mockedRequests[matchedPath];
  }

  shouldMock(path) {
    return !!( path.includes('/mock/') );
  }

  shouldClearMocks(path) {
    return !!( path.includes('/clear') );
  }

  login() {
    console.log(this.config.domain);
    this.http.post(
      this.config.domain + '/idp/auth',
      { 'username': 'HSA_w_telehealth_vnh_1' }
    ).then(data => {
      const input = '<input type="hidden" name="SAMLResponse" id="SAMLResponse" value=';
      const end = ' />';
      const SAMLResponse = data.body.split(input)[1].split(end)[0].replace(`"`,``).trim();

      this.http.post(
        this.config.domain + '/auth/consume',
        { 'SAMLResponse': SAMLResponse, 'relaystate': ''}
      ).then(data => {
        this._session_id = data.headers['set-cookie'].find(cookie => cookie.indexOf('_session_id') > -1);
        console.log(this._session_id);
      });
    });
  }

}

module.exports = RequestHandler;
