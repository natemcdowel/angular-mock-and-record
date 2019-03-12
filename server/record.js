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
      let recordingWithDomain = recording ? recording.find(rec => !!(rec.domain === this.config.domain && !rec.context)) : null;
      let recordingWithContext = recording ? recording.find(rec => !!(rec.context === this.config.context && rec.domain === this.config.domain)) : null;
      let shouldCheckContext = this.config.context;

      if (recording.length) {

        // If no context or domain, use the first
        if (!recordingWithDomain && !shouldCheckContext) {

          out = recording[0];
  
        // If no context and domain, use the domain recording
        } else if (!shouldCheckContext && recordingWithDomain && !recordingWithDomain.context) {
          
          out = recordingWithDomain;

        }

        // Lastly record a context-specific recording if context enabled
        if (shouldCheckContext && recordingWithContext) {
          
          out = recordingWithContext;
  
        } 

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

    if (this.config.domain) {
      data.domain = this.config.domain;
    }

    if (this.config.context) {
      data.context = this.config.context;
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
