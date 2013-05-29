
/**
 * Module dependencies
 */
var request = require('superagent')
  , debug = require('simple-debug')('heroku')
  , exec = require('child_process').exec;


module.exports.sharedClient = null;

module.exports = function(done) {
  if (module.exports.sharedClient) {
    return done(null, module.exports.sharedClient);
  }

  var token = process.env.HEROKU_API_KEY;
  if (!token) {
    exec('heroku auth:token', function (error, stdout, stderr) {
      if (error) return done(error);

      token = stdout.split('\n').shift();
      if (!token) {
        return done("Please login to the heroku toolbelt or set $HEROKU_API_KEY in this shell to continue.");
      } else {
        module.exports.sharedClient = new Heroku(token);
        return done(null, module.exports.sharedClient);
      }
    });
  }
}

function Heroku(token) {
  this.token = token;
}

Heroku.prototype.setConfigVar = function(app, key, value, done) {
  debug('fn=setConfigVar app-name='+app+' key='+key+' value='+value);
  var config = {};
  config[key] = value;
  return this.putConfigVars(app, config, done);
}

Heroku.prototype.putConfigVars = function(app, keys, done) {
  debug('fn=putConfigVars app-name='+app+' vars='+JSON.stringify(JSON.stringify(keys)));
  request
    .put('https://api.heroku.com/apps/' + app + '/config_vars')
    .auth('', this.token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(keys)
    .on('error', done)
    .end(function(res) {
      if (res.ok) {
        done(null, res.body);
      } else {
        done('Error : ' + res.text);
      }
    });
}


Heroku.prototype.getConfigVars = function(app, done) {
  debug('fn=getConfigVars app-name='+app);
  request
    .get('https://api.heroku.com/apps/' + app + '/config_vars')
    .auth('', this.token)
    .set('Accept', 'application/json')
    .on('error', done)
    .end(function(res) {
      if (res.ok) {
        done(null, res.body);
      } else {
        done('Error : ' + res.text);
      }
    });
}
