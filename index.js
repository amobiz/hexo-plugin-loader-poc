'use strict';

var Hexo = require('./hexo');

var hexo;

hexo = new Hexo();
hexo.loadPlugin('commonjs_plugin');
hexo.loadPlugin('hexo3_plugin');
