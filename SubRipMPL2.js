var fs = require('fs'),
    Buffer = require('buffer').Buffer,
    StringDecoder = require('string_decoder').StringDecoder;
var nazwa=process.argv.slice(2);
var decoder = new StringDecoder('utf8');
var frames = 23.98;
fs.readFile(nazwa+'.txt', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var content = data.toString('binary');
  content = content.replace(/\d*\W*\n(\d\d):(\d\d):(\d\d),(\d*)\s*-->\s*(\d\d):(\d\d):(\d\d),(\d*)\W*\n/gi,function(match,p1,p2,p3,p4,p5,p6,p7,p8,offset,string) {
    p1 = parseInt(p1)*3600;
    p2 = parseInt(p2)*60;
    p3 = parseInt(p3);
    p4 = parseInt(p4)*0.001;

    p5 = parseInt(p5)*3600;
    p6 = parseInt(p6)*60;
    p7 = parseInt(p7);
    p8 = parseInt(p8)*0.001;

    return '{'+~~((p1+p2+p3+p4)*frames)+'}'+'{'+~~((p5+p6+p7+p8)*frames)+'}';
  });
  content = content.replace(/\r\n/gi,'|');
  content = content.replace(/\|\|/gi,'\r\n');
  var buf = new Buffer(content,'binary');
  fs.writeFile(nazwa+".srt", buf, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});
