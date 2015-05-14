var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject({
	target: 'ES5',
	module: 'commonjs',
	typescript: require('typescript')
});

gulp.task('scripts', function() {
	return gulp.src('lib/**/*.ts')
		.pipe(ts(tsProject))
		.pipe(gulp.dest('release'));
});

gulp.task('test', ['scripts'], function() {
	var lib = require('./release');
	
	return gulp.src('test/input/**.js')
		.pipe(lib(['promise', 'fetch'], { /* fileName: 'file.js' */ }))
		.pipe(gulp.dest('test/output'));
});

gulp.task('default', ['scripts']);
