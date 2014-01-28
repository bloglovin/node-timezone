var expect = require('chai').expect;
var sinon = require('sinon');
var tz = require('./../index')();

describe('Timezone', function () {
  describe('getTime', function () {
    it('should return a date object', function (done) {
      tz.getTime('Europe/Stockholm', function (err, result) {
        expect(result).to.be.an.instanceof(Date);
        done();
      });
    });

    it('should be the same time', function (done) {
      tz.getTime('Europe/Stockholm', function (err, result) {
        expect(result).to.be.an.instanceof(Date);
        var sthlm_hour = result.getHours();
        tz.getTime('Europe/Amsterdam', function (err, result) {
          expect(result).to.be.an.instanceof(Date);
          var ams_hour = result.getHours();
          expect(ams_hour).to.equal(sthlm_hour);
          done();
        });
      });
    });

    it('should be correct difference', function (done) {
      tz.getTime('Europe/Stockholm', function (err, result) {
        expect(result).to.be.an.instanceof(Date);
        var sthlm_hour = result.getHours();
        tz.getTime('Europe/London', function (err, result) {
          expect(result).to.be.an.instanceof(Date);
          var lon_hour = result.getHours();

          // wrapped day
          if (lon_hour > sthlm_hour) {
            lon_hour -= 24;
          }

          expect(lon_hour).to.equal(sthlm_hour - 1);
          done();
        });
      });
    });

    it('should return an error on invalid timezone', function (done) {
      tz.getTime('Europe/23123', function (err, result) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
    });
  });
});
