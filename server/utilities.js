const fs = require('fs');
const path = require('path');
const _ = require('lodash');

class Utilities {

  getParams(url) {
    let arrayRouteParams = (url).replace('?', '&').split('&');
    return arrayRouteParams;
  }

  matchPath(path) {
    let out = '';

    path.split('/').forEach((piece, index) => {
      if (piece.match(/(^f\d+|^p\d+|^\d+$)/g)) {
        piece = '*';
      }
      out += index > 0 ? '/' : '';
      out += piece;
    });
  
    return out;
  }

  removeParam(key, sourceURL) {
    let rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";

    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
          param = params_arr[i].split("=")[0];
          if (param === key) {
              params_arr.splice(i, 1);
          }
      }
      rtn = rtn + "?" + params_arr.join("&");
    }

    return rtn;
  }

  normalizeParam(key, sourceURL) {
    let normalizedParams = [];

    sourceURL.split('&').forEach(param => {
      let splitParam = param.split('=');
      let paramKey = splitParam[0];
      let paramValue = splitParam[1];

      if (key === paramKey) {
        paramValue = paramValue.replace(/[0-9]/g, '');
      }

      normalizedParams.push(paramKey + '=' + paramValue);
    });

    return normalizedParams.join('&');
  }

  normalizePath(path) {
    return path.replace('.json', '').replace(/[0-9]/g, "x");
  }

  mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
  
    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
  
      return curDir;
    }, initDir);
  }

}

module.exports = Utilities;
