var assert = require('assert'),
    fs     = require('fs'),
    path   = require('path'),
    gs     = require('../index');

var tmpPath = path.resolve('./tmp');
try {
  fs.mkdirSync(tmpPath);
} catch (ex) {
  // nada
}

describe('ghostscript', function() {
  describe('#batch', function() {
    it('should set batch option', function(done) {
      assert.deepEqual(gs().batch().options, ['-dBATCH']);
      done();
    });
  });

  describe('#device', function() {
    it('should set device option with default', function(done) {
      assert.deepEqual(gs().device().options, ['-sDEVICE=pdfwrite']);
      done();
    });

    it('should set device option with value', function(done) {
      assert.deepEqual(gs().device('png').options, ['-sDEVICE=png']);
      done();
    });
  });

  describe('#exec', function() {
    it('should pass an error for no input', function(done) {
      gs()
        .batch()
        .nopause()
        .device()
        .output()
        .exec(function(err, stdout, stderr) {
          assert.ok(err);
          assert.ok(!this._input);
          assert.equal(err.message, 'Please specify input file(s)');
          done();
        });
    });

    it('should convert pdf to jpeg', function(done) {
      var dest    = path.resolve('./tmp/test-' + Date.now() + '.jpg')
          // logFile = path.resolve('./tests/pdfs/pdf-util.log');
      gs()
        .batch()
        .nopause()
        .device('jpeg')
        .output(dest)
        .input(path.resolve('./tests/pdfs/sample-img.pdf'))
        .exec(function(err, stdout, stderr) {
          if ( err ) {
            console.warn('Error:::', err, stdout, stderr);
            assert.ok(!err);
            return done(err, stdout, stderr)            
          }
          // stderr.pipe( process.stdout );
          function showData(data) {
            console.log(Date.now(), ' ', data);
          }
          if ( stdout && stdout.on ) { stdout.on('data', showData) }
          if ( stderr && stderr.on ) { stderr.on('data', showData) }
          // var stream = stdout
          //   .pipe(fs.createWriteStream(logFile, 'a'))
          // stderr
          //   .pipe(fs.createWriteStream(logFile + '.err', 'a'))
          done();
        });
    });
  });
  describe('#combine pdf files', function() {
    it('should join 2 pdfs together', function(done) {
      var dest = path.resolve('./tmp/output-join-2-pdfs.pdf');
      gs()
        .batch()
        .nopause()
        .quiet()
        .device()
        .output(dest)
        .input([
          path.resolve('./tests/pdfs/sample-img.pdf'),
          path.resolve('./tests/pdfs/sample-fonts.pdf')
        ])//added 2 paths
        .input(path.resolve('./tests/pdfs/sample-two-page.pdf'))//added a single 2-page PDF
        .exec(function(err, stdout, stderr, cmd) {
          if ( err ) {
            console.warn('Error :-> ', err, arguments);
            assert.ok(!err);
          }

          fs.stat(dest, function _stat(err, stat) {
            assert.ok(!err);
            var isNewFileSizeValid = ( stat.size >= 15000 );
            assert.ok( isNewFileSizeValid, 'File Too Small! Current file size for '.concat(dest).concat(': ').concat(stat.size));
            done();
          });
        });
    });

  });

  describe('#input', function() {
    it('should set input', function(done) {
      assert.deepEqual(gs().input('file')._input[0], 'file');
      done();
    });
  });

  describe('#jpegq', function() {
    it('should set jpeg quality option with default', function(done) {
      assert.deepEqual(gs().jpegq().options, ['-dJPEGQ=75']);
      done();
    });

    it('should set jpeg quality option with value', function(done) {
      assert.deepEqual(gs().jpegq(85).options, ['-dJPEGQ=85']);
      done();
    });
  });

  describe('#nopause', function() {
    it('should set nopause option', function(done) {
      assert.deepEqual(gs().nopause().options, ['-dNOPAUSE']);
      done();
    });
  });

  describe('#output', function() {
    it('s', function(done) {
      assert.deepEqual(gs().output().options, ['-sOutputFile=-', '-dQUIET']);
      done();
    });

    it('should set output option with value', function(done) {
      assert.deepEqual(gs().output('bacon').options, ['-sOutputFile=bacon']);
      done();
    });
  });

  describe('#quiet', function() {
    it('should set quiet option', function(done) {
      assert.deepEqual(gs().quiet().options, ['-dQUIET']);
      done();
    });
  });

  describe('#resolution', function() {
    it('should set device resolution', function(done) {
      assert.deepEqual(gs().res(144, 144).options, ['-r144x144']);
      done();
    });

    it('should set device resolution', function(done) {
      assert.deepEqual(gs().res(144).options, ['-r144']);
      done();
    });
  });
});

