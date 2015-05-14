/// <reference path="../node_modules/microfill/release/typings.d.ts" />
/// <reference path="../node_modules/microfill/lib/typings-fix.d.ts" />
/// <reference path="../typings/tsd.d.ts" />

import * as path from 'path';
import * as through2 from 'through2';
import * as microfill from 'microfill';
import * as gutil from 'gulp-util';

const pluginName = 'gulp-microfill';

interface Options {
	minified?: boolean;
	fileName?: string | ((file: gutil.File) => string);
}

function compile(polyfills: (string | microfill.Polyfill)[], options: Options = {}) {
	return through2.obj(function(file: gutil.File, enc, callback) {
		if (file.isNull()) {
			// Empty file
			this.push(file);
			callback();
			return;
		}
		if (file.isStream()) {
			throw new gutil.PluginError(pluginName, 'Streaming is not supported');
		}
		
		const write: microfill.FileWriter = (output) => {
			let content: Buffer;
			if (typeof output.content === 'string') {
				content = new Buffer(<string> output.content);
			} else {
				content = <Buffer> output.content;
			}
			
			this.push(new gutil.File({
				cwd: file.cwd,
				base: file.base,
				path: output.fileName,
				contents: content
			}));
			
			return Promise.resolve(undefined);
		};
		
		let fileName: string;
		if (options.fileName === undefined) {
			fileName = file.relative;
		} else if (typeof options.fileName === 'string') {
			fileName = <string> options.fileName;
		} else {
			fileName = (<(file: gutil.File) => string> options.fileName)(file);
		}
		
		let mFile: microfill.File = {
			fileName: file.path,
			content: file.contents
		};
		
		microfill.compile(mFile, file.path, fileName, polyfills, options.minified, write).then(() => {
			callback();
		}).catch((reason) => {
			this.emit('error', new gutil.PluginError(pluginName, reason.message || reason.toString()));
			callback();
		});
	});
}

export = compile;
