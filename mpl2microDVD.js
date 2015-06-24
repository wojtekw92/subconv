var fs = require('fs'),
    Buffer = require('buffer').Buffer,
    StringDecoder = require('string_decoder').StringDecoder;
var nazwa = process.argv.slice(2);
var decoder = new StringDecoder('utf8');
var frames = 23.98;
fs.readFile(nazwa+'.txt', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var content = data.toString('binary');
  content = content.replace(/\[(\d+)\]\[(\d+)\](.*)/gi,function(match,p1,p2,p3,offset,string) {
    return '{'+~~(parseInt(p1)*frames/10)+'}'+'{'+~~(parseInt(p2)*frames/10)+'}'+p3;
  });
  var buf = new Buffer(content,'binary');
  fs.writeFile(nazwa+".srt", buf, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});
