
/**
 * Module dependencies.
 */
var config = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.keyset.json'));

exports.secretKeyName = function() {
  return config.secretKeyName || 'SECRET_KEY';
}

exports.envList = function() {
  return Object.keys(config.envs);
}

exports.authApp = function(env) {
  return config.envs[env].auth;
}

exports.appList = function(env) {
  return config.envs[env].apps;
}
