
/**
 * Module dependencies
 */
var Table = require('cli-table')
  , deploy = require('./deploy')
  , utils = require('./utils')
  , heroku = require('./heroku').sharedClient;

function getAllKeys(env, done) {
  var apps = deploy.appList(env);
  utils.batchAndZip(apps, function(app, appDone) {
    heroku.getConfigVars(app, function(err, config) {
      if (err) return appDone(err);
      appDone(null, config.TOKEN_HEX_KEY);
    });
  }, done);
}

function printTable(env, done) {
  getAllKeys(env, function(err, appKeys) {
    if (err) return done(err);
    var table = new Table({
      head: ["Env", "App", "Key"],
      colWidths: [10, 25, 66]
    });
    for (var i = 0; i < appKeys.length; i++) {
      table.push([env, appKeys[i][0], appKeys[i][1]]);
    };
    console.log(table.toString());
    done();
  });
}

/**
 * Print a table of the app keys
 */
module.exports = function() {
  deploy.envList().forEach(function(env) {
    printTable(env, function(err) {
      if (err) return console.log('ERROR: ' + err);
    });
  });
};
