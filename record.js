const Utilities = require('./utilities.js');

class Record {

  constructor(config) {
    this.fs = require('fs');
    this.config = config;
    this.utilities = new Utilities();
  }

  findRecording(req, label) {
    let recording = this.recordingExists(req.path, req.url, label);

    if (recording) {
      return recording;
    }

    return null;
  }

  recordingExists(requestPath, requestUrl, label) {
    let out = null;
    let tape = this.tapeExists(requestPath, label);

    if (tape) {
      let recording = this.isRecordingOnTape(requestUrl, tape);
      if (recording.length) {
        out = recording[0];
      }
    }
  
    return out;
  }

  tapeExists(requestPath, label) {
    try {
      return JSON.parse(
        this.fs.readFileSync(
          this.config.recording_dir + this.utilities.normalizePath(requestPath) + '/' + label + '.json', 'utf8'
        )
      );
    } catch(error) {
      return null;
    }
  }

  isRecordingOnTape(requestUrl, tape) {
    return tape.filter(recording => {
      let redactedRecordingUrl;
      let redactedRequestUrl;

      this.config.exclude_params.forEach(param => {
        redactedRecordingUrl = this.utilities.removeParam(param, redactedRecordingUrl || recording.mock_request_url);
        redactedRequestUrl = this.utilities.removeParam(param, redactedRequestUrl || requestUrl);
      });

      this.config.normalize_params.forEach(param => {
        redactedRecordingUrl = this.utilities.normalizeParam(param, redactedRecordingUrl || recording.mock_request_url);
        redactedRequestUrl = this.utilities.normalizeParam(param, redactedRequestUrl || requestUrl);
      });

      if (redactedRecordingUrl === redactedRequestUrl) {
        return recording;
      }
    });
  }

  recordTape(data, requestPath, label) {
    let out = [];
    let dir = this.config.recording_dir + this.utilities.normalizePath(requestPath);
    let tape = this.tapeExists(requestPath, label);

    if (tape) {  
      out = tape;
    }

    out.push(data);
    
    if (!this.fs.existsSync(dir)){
      this.utilities.mkDirByPathSync(dir);
    }

    this.fs.writeFileSync(
      dir + '/' + label + '.json',
      JSON.stringify(out, null, 2) + '\r\n'
    );
  }
}

module.exports = Record;
