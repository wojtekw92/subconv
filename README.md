# SUBCONV
Small command line tool for converting subtitles.

## ABOUT

Subconv is a small command line tool for converting subtitles.
It can convert subtitles between formats:
* TMP
* MPL2
* SubRip
* MicroDvd

## HOW TO INSTALL
```
git clone git@github.com:wojtekw92/subconv.git
```

or

```
npm i subconv -g
```

## USAGE
```
Options:

-h, --help                 output usage information
-V, --version              output the version number
-c, --convert <format>     convert input subtitles to output with selected format
-i, --input <file>         input file
-o, --output <file>        output file
-C, --check <file>         Chceck subtitle format in file
-o, --output <outputFile>  File with converted subtitles
-f, --fps [fps]            Set FPS for some subtitles format[23.98]
```

if you don't give output file it will override input file


## TO DO

* convert from tmp to all formats
* convert from mpl2 to subrip
* convert from subrip to tmp and microDVD
* convert from MicroDvd to TMP and SubRip
