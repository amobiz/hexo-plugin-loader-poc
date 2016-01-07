/* eslint no-console: 0 */
'use strict';

var fs = require('fs');
var vm = require('vm');
var Module = require('module');

function Registry() {
}

Registry.prototype.register = function (names) {
	console.log(names);
};

function Hexo() {
	this.extend = {
		renderer: new Registry()
	};
}

Hexo.prototype.loadPlugin = function (name) {
	var self, path;

	self = this;
	path = process.cwd() + '/plugins/' + name;
	try {
		commonjs(report);
	} catch (ex) {
		hexo3(report);
	}

	// commonjs way
	function commonjs(done) {
		var plugin, result;

		plugin = require(path);
		if (typeof plugin === 'function') {
			result = plugin(self);
			done(null, result);
			return true;
		}
	}

	// fall back to hexo 3 way
	function hexo3(done) {
		var filename = path + '.js';
		var dirname = process.cwd();

		fs.readFile(filename, _load);

		function _load(err, content) {
			var script, module, plugin, result;

			module = new Module(path);
			module.filename = filename;
			module.paths = Module._nodeModulePaths(filename);
			script = '(function(exports, require, module, __filename, __dirname, hexo){' + content + '});';
			plugin = vm.runInThisContext(script);
			result = plugin(module.exports, module.require.bind(module), module, filename, dirname, self);
			done(null, result);
		}
	}

	function report(err) {
		if (err) {
			console.log('Plugin load failed: ' + path);
		} else {
			console.log('Plugin loaded: ' + path);
		}
	}
};

module.exports = Hexo;
