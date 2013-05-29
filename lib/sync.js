
/**
 * Module dependencies
 */
var deploy = require('./deploy')
  , utils = require('./utils')
  , heroku = require('./heroku').sharedClient
  , check = require('./check')
  , Batch = require('batch');

function getAuthKey(env, done) {
  heroku.getConfigVars(deploy.authApp(env), function(err, config) {
    if (err) return console.log(err);
    done(null, config[deploy.secretKeyName()]);
  });
}

function syncNonAuthKeys(env, done) {
  getAuthKey(env, function(err, key) {
    var apps = deploy.appList(env);
    utils.batchAndZip(apps, function(app, appDone) {
      if (app === deploy.authApp(env)) return done();
      heroku.setConfigVar(app, deploy.secretKeyName(), key, function(err) {
        if (err) return appDone(err);
        appDone();
      });
    }, done);
  });
}

/**
 * Print a table of the app keys
 */
module.exports = function() {
  batch = new Batch;

  batch.concurrency(4);
  deploy.envList().forEach(function(env) {
    batch.push(function(itemDone) {
      syncNonAuthKeys(env, function(err) {
        if (err) return itemDone(err);
        itemDone();
      });
    });
  });

  batch.end(function(err, items) {
    if (err) return console.log('ERROR ' + err);
    check();
  });
};
