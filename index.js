var exec = require('child_process').exec;

var create = function() {
  return new gs();
};

var gs = function() {
  this.options = [];
  this._input = [];
};

gs.prototype.batch = function() {
  this.options.push('-dBATCH');
  return this;
};

gs.prototype.device = function(device) {
  device = device || 'pdfwrite';
  this.options.push('-sDEVICE=' + device);
  return this;
};

gs.prototype.exec = function(callback) {
  var self = this;

  if (!this._input.length) return callback(new Error("Please specify input file(s)"));

  var args = this.options.concat(this._input).join(' ');
  exec('gs ' + args, function(err, stdout, stderr) {
    callback(err, stdout, stderr, args);
  });
};

gs.prototype.input = function(file) {
  var self = this;
  if ( arguments.length >= 2 && typeof(arguments[1])==='string' ) {
    this._input.concat([].slice.call(arguments));
  } else if ( typeof(file) === 'string' ) {
    this._input.push(file);
  } else if ( Array.isArray(file) ) {
    file.forEach(function _each(f) {
      if (f) { self._input.push(f); }
    });
  } else {
    throw new TypeError('ghostscript.input([path]) needs valid param(s)')
  }
  return this;
};

gs.prototype.jpegq = function(value) {
  value = value || 75;
  this.options.push('-dJPEGQ=' + value);
  return this;
};

gs.prototype.nopause = function() {
  this.options.push('-dNOPAUSE');
  return this;
};

gs.prototype.output = function(file) {
  file = file || '-';
  this.options.push('-sOutputFile=' + file);
  if (file === '-') return this.quiet();
  return this;
};

gs.prototype.q = gs.prototype.quiet;

gs.prototype.quiet = function() {
  this.options.push('-dQUIET');
  return this;
};

gs.prototype.resolution = function(xres, yres) {
  this.options.push('-r' + xres + (yres ? 'x' + yres : ''));
  return this;
};

gs.prototype.r = gs.prototype.res = gs.prototype.resolution;

module.exports = create;
