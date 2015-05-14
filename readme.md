gulp-microfill
==============
Only loads polyfills for the missing gabs

How to install
--------------
##### 1. Install gulp CLI
```shell
npm install --global gulp
```
##### 2. Install gulp as a project dependency
```shell
npm install gulp --save-dev
```
##### 3. Install gulp-microfill
```shell
npm install gulp-microfill --save-dev
```

How to use
----------
```javascript
var gulp = require('gulp');
var microfill = require('gulp-microfill');

gulp.task('default', function() {
	gulp.src('lib/**/*.js')
		.pipe(microfill(['set-immediate', 'promise', 'fetch', 'collection']))
		.pipe(gulp.dest('release'))
});
```

Options
-------
`gulp-microfill` takes two arguments, an array with the polyfills and optionally an option object.
See [microfill](https://github.com/ivogabe/microfill) for a complete list of all supported polyfills.

The option object may contain:
- `minified` (boolean) - Use a minified loader and minified polyfills (if available)
- `fileName` (string or function) - The filename used in the loader. This should be relative to the base url of your webpage. If you specify a function, it will be invoked for every file and should return the fileName as a string.

How does it work
----------------
Microfill replaces your javascript file with a file that looks like this:
```javascript
;(function(){
	var hex = 0;

	if (!window.setImmediate) hex += 1 << 0;
	if (!window.Promise) hex += 1 << 1;
	if (!window.fetch) hex += 1 << 2;
	if (!window.WeakMap || !window.Map || !window.Set) hex += 1 << 3;

	var script = document.createElement("script");
	script.src = "file-" + hex.toString(16) + ".js";
	script.type = "text/javascript";
	document.head.appendChild(script);
})();
```
If a feature is missing, `hex` will be increased by a certain value. Based on the final value of `hex` a file will be loaded.
Microfill generates such file for every possible combination of polyfills that are needed. See the `test` directory for a sample output.

License
-------
MIT
