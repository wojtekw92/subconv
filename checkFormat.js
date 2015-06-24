var fs = require('fs'),
Buffer = require('buffer').Buffer,
StringDecoder = require('string_decoder').StringDecoder;
var nazwa = process.argv.slice(2);
console.log(nazwa[0]);
var decoder = new StringDecoder('utf8');
fs.readFile(nazwa[0], function (err,data) {
  if (err) {
    return console.log(err);
  }
  var content = data.toString('binary');
  if(content.match(/\{\d+\}\{\d+\}.*/i)) {
    console.log('mpl2');
  } else if(content.match(/\[\d+\]\[\d+\].*/i)) {
    console.log('microdvd');
  } else if(content.match(/\d*\W*\n\d\d:\d\d:\d\d,\d*\s*-->\s*\d\d:\d\d:\d\d,\d*\W*\n/i)) {
    console.log('subrip');
  } else {
    console.log('unknow format')
  }
});
