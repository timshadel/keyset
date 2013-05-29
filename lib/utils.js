
/**
 * Module dependencies.
 */
var Batch = require('batch')
  , crypto = require('crypto');

exports.generateKey = function() {
  return crypto.randomBytes(32);
};

exports.generateHexKey = function() {
  return exports.generateKey().toString('hex');
};

exports.batchAndZip = function(keys, fn, done) {
  batch = new Batch;

  batch.concurrency(4);
  keys.forEach(function(key) {
    batch.push(function(itemDone) {
      fn(key, itemDone);
    });
  });

  batch.end(function(err, items) {
    if (err) return done(err);
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values[i] = [ keys[i], items[i] ];
    };
    done(null, values);
  });
}
