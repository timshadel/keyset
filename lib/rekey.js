
/**
 * Module dependencies
 */
var deploy = require('./deploy')
  , utils = require('./utils')
  , heroku = require('./heroku').sharedClient
  , check = require('./check');


/**
 * Print a table of the app keys
 */
module.exports = function(env) {
  heroku.setConfigVar(deploy.authApp(env), deploy.secretKeyName(), utils.generateHexKey(), function(err) {
    if (err) console.log(err);
    check();
  });
};
