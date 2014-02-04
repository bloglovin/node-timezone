var lib = {
  timezone: require('../index.js')
};

var preDstSwe = lib.timezone.getUTCTime('2014-03-29T09:00:00.000Z', 'Europe/Stockholm');
var postDstSwe = lib.timezone.getUTCTime('2014-03-30T09:00:00.000Z', 'Europe/Stockholm');

var preDstNy = lib.timezone.getUTCTime('2014-03-08T09:00:00.000Z', 'America/New_York');
var postDstNy = lib.timezone.getUTCTime('2014-03-09T09:00:00.000Z', 'America/New_York');

console.log("Pre DST Sweden:", new Date(preDstSwe*1000));
console.log("Post DST Sweden:", new Date(postDstSwe*1000));

console.log("Pre DST New York:", new Date(preDstNy*1000));
console.log("Post DST New York:", new Date(postDstNy*1000));

try {
  lib.timezone.getUTCTime('Foo!', 'Europe/Stockholm');
} catch (e) {
  console.log('Non ISO datetime:', e);
}
