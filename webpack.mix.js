
let mix = require('laravel-mix');

mix
	.js('assets/src/visa.output.export.js', 'assets/js/visa.output.export.js')
	.js('assets/src/visa.output.js', 'assets/js/visa.output.js')
	.setPublicPath('./assets');
