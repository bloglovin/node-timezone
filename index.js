var exec = require('child_process').exec;
var util = require('util');

var TZ = function () {
  this.timecmd = 'TZ=%s date "+%Y-%m-%d %H:%M:%S"';
};

//
// ## Get time
// Get a date object with current time set for a particular
// timezone given, or Error on invalid timezone string
//
// * **timezone** string
// * **cb** function(err, result)
//
TZ.prototype.getTime = function (timezone, cb) {
  timezone = this.validateTimezone(timezone);

  if ( ! timezone) {
    var error = new Error('Invalid timezone');
    return cb(error, null);
  }

  var cmd = util.format(this.timecmd, timezone);
  var child = exec(cmd, function (err, stdout, stderr) {
    var regexp = new RegExp('\r?\n|\r', 'g');
    var time_string = stdout.replace(regexp, '');
    var time_object = new Date(time_string);
    cb(null, time_object);
  });
};

TZ.prototype.validateTimezone = function (string) {
  var regexp = new RegExp('[a-zA-Z]+\/[a-zA-Z]+','i');

  return regexp.test(string) ? string : false;
};

module.exports = function () {
  return new TZ();
};

