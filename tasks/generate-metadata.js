const {dest} = require('gulp')
const Promise = require('bluebird')
const _ = {
	pickBy: require('lodash.pickby')
}
const {Readable: ReadableStream} = require('stream')
const request = require('request-promise')
const semver = require('semver')
const Vinyl = require('vinyl')

async function fetch() {
	return request({
		url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json',
		headers: {
			'User-Agent': 'Request-Promise',
		},
		json: true,
	})
}

/**
 * Pick icons with at least one "changes" version lesser than or equal to the installed version.
 */
function filter(metadata) {
	let {version: installedVersion} = require('@fortawesome/fontawesome-free/package.json')
	return _.pickBy(metadata, icon => {
		let changeVersions = Array.from(icon.changes)
		return changeVersions.some(version => semver.lte(semver.coerce(version), installedVersion))
	})
}

/**
 * Categorize icons by styles supported in free version.
 */
function process(metadata) {
	let result = {regular: {}, solid: {}, brands: {}}
	Object.keys(metadata).forEach(icon => {
		let styles = metadata[icon].free
		let codePoint = metadata[icon].unicode
		Object.keys(result).forEach(style => {
			if (styles.includes(style)) {
				result[style][icon] = codePoint
			}
		})
	})
	return result
}

async function output(metadata) {
	let stream = new ReadableStream({objectMode: true})
	for (let style in metadata) {
		stream.push(new Vinyl({
			path: `${style}.json`,
			contents: Buffer.from(JSON.stringify(metadata[style])),
		}))
	}
	stream.push(null)
	return new Promise((resolve, reject) =>
		stream.pipe(dest('metadata/'))
			.on('end', () => resolve())
			.on('error', reject)
	)
}

async function generateMetadata() {
	const metadata = process(filter(await fetch()))
	return output(metadata)
}

module.exports = generateMetadata
