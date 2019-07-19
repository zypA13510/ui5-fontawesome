const {src, dest} = require('gulp')
const decompress = require('gulp-decompress')
const rename = require('gulp-rename')
const zip = require('gulp-zip')

function convertTarballToZip() {
	let {name, version} = require('../package.json')
	return src(`dist/${name}-${version}.tgz`)
		.pipe(decompress())
		.pipe(rename(file => {
			file.dirname = file.dirname.replace(/^package/, name)
		}))
		.pipe(zip(`${name}-${version}.zip`))
		.pipe(dest('dist/'))
}

module.exports = convertTarballToZip
