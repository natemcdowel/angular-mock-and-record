let find = require('find');
let rl = require('readline');
let fs = require('fs');
let config = require('./config.json');

class ClearMocks {

  ask(question, callback) {
    let r = rl.createInterface({
      input: process.stdin,
      output: process.stdout});
    r.question(question + '\n', function(answer) {
      r.close();
      callback(answer);
    });
  }

  getQuestionText(mock, files) {
    let out = '';
    console.log(files);
    out = '\nAre you sure you want to delete mocks for "' + mock + '" ? (Y/N)';
    out += '\n\nThe files above will be removed.\n';

    return out;
  }

  clear(mock) {
    if (!mock) {
      console.log('Please add an argument with the name of the mock.');
    }

    find.file(config.recording_dir + '/' + mock + '.json', __dirname, files => {
      if (files.length) {
        this.ask(this.getQuestionText(mock, files), answer => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            files.forEach(file => this.deleteFile(file));
          }
        });
      } else {
        console.log('No mocks were found for "' + mock + '"');
      }
    });
  }

  deleteFile(file) {
    fs.unlink(file, (err) => {
      if (err) {
        throw err;
      }
      console.log(file + ' was deleted');
    });
  }
}

let clearMocks = new ClearMocks();
clearMocks.clear(process.argv[2]);
