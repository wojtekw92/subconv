var program = require('commander');
var fs = require('fs'),
Buffer = require('buffer').Buffer;
//StringDecoder = require('string_decoder').StringDecoder;
/*
[
  {
    starttime:,
    subs:
  }

]

*/
var checkType = function(data) {
  if(data.match(/\d+:\d+:\d+:.*/i)) {
    return 'TMP';
  } else if(data.match(/\{\d+\}\{\d+\}.*/i)) {
    return 'MPL2';
  } else if(data.match(/\[\d+\]\[\d+\].*/i)) {
    return 'MicroDVD';
  } else if(data.match(/\d*\W*\n\d\d:\d\d:\d\d,\d*\s*-->\s*\d\d:\d\d:\d\d,\d*\W*\n/i)) {
    return 'SubRip';
  } else {
    return 'unknow format';
  }
}
var tmpTo = function(format, content, fps){
  switch(format) {
    case 'TMP':
      return content;
      break;
    case 'MPL2':
      var subsArray=[];
      content.replace(/(\d+):(\d+):(\d+):(.*)/gi,function(match,p1,p2,p3,p4,offset,string) {
        var beginTime =(parseInt(p1)*3600+parseInt(p2)*60+parseInt(p3))*10;
        subsArray.push({startTime:beginTime,sub:p4});
      });

      break;
    case 'MicroDVD':
      break;
    case 'SubRip':
      break;
  }
}
var readFile = function(filename) {
  var data='';
  try {
    data = fs.readFileSync(filename).toString('binary');
  } catch (e) {
    console.log('Can\'t read file: "'+filename+'"');
    return '';
  }
  return data;
}
var writeFile = function(filename, data) {
  var buf = new Buffer(data,'binary');
  try {
  fs.writeFileSync(filename, buf);
  } catch(e) {
    console.log('Can\'t write file: "'+filename+'"');
    return false;
  }
  return true;
}
program
  .version('0.0.1')
  .option('-c, --convert <format>', 'convert input subtitles to output with selected format')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-C, --check <file>', 'Chceck subtitle format in file')
  .option('-o, --output <outputFile>', 'File with converted subtitles')
  .option('-f, --fps [fps]', 'Set FPS for some subtitles format[23.98]', 23.98)
  .parse(process.argv);

  //--check <file>
  if(program.check) {
    var content = readFile(program.check);
    if(content!='')
      return console.log(checkType(content));
  }

  //--convert <format>
  if(program.convert) {
    if(!program.input || !program.output) {
      return console.log('you have to give input and output file');
    }
    var content = readFile(program.input);
    switch(checkType(content)) {
      case 'MicroDVD':
        if(program.convert="MPL2") {
          content = content.replace(/\[(\d+)\]\[(\d+)\](.*)/gi,function(match,p1,p2,p3,offset,string) {
            return '{'+~~(parseInt(p1)*parseFloat(program.fps)/10)+'}'+'{'+~~(parseInt(p2)*parseFloat(program.fps)/10)+'}'+p3;
          });
          writeFile(program.output, content);
        }
        break;
    }

  }
