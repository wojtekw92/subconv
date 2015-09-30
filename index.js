#! /usr/bin/node
var program = require('commander');
var fs = require('fs'),
Buffer = require('buffer').Buffer;

var checkType = function(data) {
  if(data.match(/^\d+:\d+:\d+:.*/i)) {
    return 'TMP';
  } else if(data.match(/^\{\d+\}\{\d+\}.*/i)) {
    return 'MPL2';
  } else if(data.match(/^\[\d+\]\[\d+\].*/i)) {
    return 'MicroDVD';
  } else if(data.match(/^\d*\W*\n\d\d:\d\d:\d\d,\d*\s*-->\s*\d\d:\d\d:\d\d,\d*\W*\n/i)) {
    return 'SubRip';
  } else {
    return 'unknow format';
  }
};

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
};

var mpl2To = function(format, content, fps) {
  switch(format) {
    case 'TMP':
      content = content.replace(/\[(\d+)\]\[(\d+)\](.*)/gi,function(match,p1,p2,p3,offset,string) {
        var time = ~~(parseInt(p1)/10);
        var hours = ~~(time/3600);
        time=time%3600;
        var minutes = ~~(time/60);
        var seconds =time%60;
        return hours+':'+minutes+':'+seconds+':'+p3;
      });
      return content;
      break;
    case 'MPL2':
      return content;
      break;
    case 'MicroDVD':
      content = content.replace(/\{(\d+)\}\{(\d+)\}(.*)/gi,function(match,p1,p2,p3,offset,string) {
        return '['+~~(parseInt(p1)*10/fps)+']'+'['+~~(parseInt(p2)*10/fps)+']'+p3;
      });
      return content;
      break;
    case 'SubRip':
      break;
  }
};

var microDvdTo = function(format, content, fps) {
  switch(format) {
    case 'TMP':
      break;
    case 'MPL2':
      content = content.replace(/\[(\d+)\]\[(\d+)\](.*)/gi,function(match,p1,p2,p3,offset,string) {
        return '{'+~~(parseInt(p1)*fps/10)+'}'+'{'+~~(parseInt(p2)*fps/10)+'}'+p3;
      });
      return content;
      break;
    case 'MicroDVD':
      return content;
      break;
    case 'SubRip':
      break;
  }
};

var subRipTo = function(format, content, fps) {
  switch(format) {
    case 'TMP':
      break;
    case 'MPL2':
      content = content.replace(/\d*\W*\n(\d\d):(\d\d):(\d\d),(\d*)\s*-->\s*(\d\d):(\d\d):(\d\d),(\d*)\W*\n/gi,function(match,p1,p2,p3,p4,p5,p6,p7,p8,offset,string) {
        p1 = parseInt(p1)*3600;
        p2 = parseInt(p2)*60;
        p3 = parseInt(p3);
        p4 = parseInt(p4)*0.001;

        p5 = parseInt(p5)*3600;
        p6 = parseInt(p6)*60;
        p7 = parseInt(p7);
        p8 = parseInt(p8)*0.001;

        return '{'+~~((p1+p2+p3+p4)*fps)+'}'+'{'+~~((p5+p6+p7+p8)*fps)+'}';
      });
      content = content.replace(/\r\n/gi,'|');
      content = content.replace(/\|\|/gi,'\r\n');
      return content;
      break;
    case 'MicroDVD':
      break;
    case 'SubRip':
      return content;
      break;
  }
};
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
    if(!program.input) {
      return console.log('you have to give input and output file');
    }
    var content = readFile(program.input);
    var output = program.input;
    if(program.output) {
      output = program.output;
    }
    switch(checkType(content)) {
      case 'TMP':
          writeFile(output, tmpTo(program.convert, content,parseFloat(program.fps)));
        break;
      case 'MPL2':
          writeFile(output, mpl2To(program.convert, content,parseFloat(program.fps)));
        break;
      case 'MicroDVD':
          writeFile(output, microDvdTo(program.convert, content,parseFloat(program.fps)));
        break;
      case 'SubRip':
          writeFile(output, subRipTo(program.convert, content,parseFloat(program.fps)));
        break;
    }
  }
