# node-ghostscript

Wrapper for ghostscript in node.js.

## Install

    npm install https://github.com/justsml/node-ghostscript/tarball/master

## Usage

```javascript
  var gs = require('ghostscript');

  gs()
    .batch()
    .quiet()
    .nopause()
    .device('jpeg')
    .input('./test.pdf')
    .input(['./test-a.pdf']) // e.g. Combine input files
    .input(['./test-2.pdf', './test-3.pdf']) // e.g. Combine input files
    .output('./test-%d.jpg')
    .r(144)
    .jpegq(90)
    .exec(function(err, stdout, stderr) {
      if (!err) {
        console.log(stdout);
      } else {
        console.log(err);
      }
    });
```
## API

* `batch`
* `device`
* `exec`
* `input`
* `jpegq`
* `nopause`
* `output`
* `r`
* `quiet`

## Test

To run test, do:

    make test

