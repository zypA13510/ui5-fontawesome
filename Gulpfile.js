const {src, dest, series, parallel} = require('gulp')
const Promise = require('bluebird')
const request = require('request-promise')
const semver = require('semver')
const Vinyl = require('vinyl')
const {Readable: ReadableStream} = require('stream')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const decompress = require('gulp-decompress')
const zip = require('gulp-zip')

async function fetchMetadata() {
	let metadata = await request({
		url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json',
		headers: {
			'User-Agent': 'Request-Promise',
		},
		json: true,
	})
	let regular = {}
	let solid = {}
	let brands = {}
	for (let iconName in metadata) {
		let iconData = metadata[iconName]
		// If the icon is introduced in a version greater than the installed version, omit it from the
		// metadata output.
		let {version: installedVersion} = require('@fortawesome/fontawesome-free/package.json')
		if (iconData.changes.every(version => semver.satisfies(installedVersion, `<${version}`))) {
			continue
		}
		let styles = iconData.free
		if (styles.includes('regular')) {
			regular[iconName] = iconData.unicode
		}
		if (styles.includes('solid')) {
			solid[iconName] = iconData.unicode
		}
		if (styles.includes('brands')) {
			brands[iconName] = iconData.unicode
		}
	}
	let results = {
		regular: JSON.stringify(regular),
		solid: JSON.stringify(solid),
		brands: JSON.stringify(brands),
	}
	let stream = new ReadableStream({objectMode: true})
	for (let style in results) {
		stream.push(new Vinyl({
			path: `${style}.json`,
			contents: Buffer.from(results[style]),
		}))
	}
	stream.push(null)
	return new Promise((resolve, reject) =>
		stream.pipe(dest('metadata/'))
			.on('end', () => resolve())
			.on('error', reject)
	)
}

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

function convertTarballToZip () {
	let {name, version} = require('./package.json')
	return src(`dist/${name}-${version}.tgz`)
		.pipe(decompress())
		.pipe(rename(file => {
			file.dirname = file.dirname.replace(/^package/, name)
		}))
		.pipe(zip(`${name}-${version}.zip`))
		.pipe(dest('dist/'))
}

function printFontAwesomeVersion(cb) {
	let {version: installedVersion} = require('@fortawesome/fontawesome-free/package.json')
	process.stdout.write(`Built with Font Awesome free ${installedVersion}` + '\n', 'ascii', cb)
}

exports.printversion = printFontAwesomeVersion
exports.clean = clean
exports.build = parallel(fetchMetadata, copy, minify)
exports.rebuild = series(exports.clean, exports.build)
exports.pack = convertTarballToZip
