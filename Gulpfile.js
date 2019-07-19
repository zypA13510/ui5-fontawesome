const {src, dest, series, parallel} = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const generateMetadata = require('./tasks/generate-metadata')
const pack = require('./tasks/pack')
const printFontAwesomeVersion = require('./tasks/print-version')

function copy() {
	return src([
		'node_modules/@fortawesome/fontawesome-free/LICENSE*',
		'node_modules/@fortawesome/fontawesome-free/webfonts/*.{ttf,woff,woff2}'
	], {base: 'node_modules/@fortawesome/fontawesome-free'})
		.pipe(dest('fontawesome-free/'))
}

function minify() {
	return src(['js/*.js', '!js/*.min.js'])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(sourcemaps.write('./'))
		.pipe(dest('js/'))
}

function clean() {
	return del([
		'metadata/**',
		'fontawesome-free/**',
		'js/**/*.min.js',
		'js/**/*.min.js.map',
	])
}

exports.printversion = printFontAwesomeVersion
exports.clean = clean
exports.build = parallel(generateMetadata, copy, minify)
exports.rebuild = series(exports.clean, exports.build)
exports.pack = pack
