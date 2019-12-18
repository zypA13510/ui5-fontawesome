const Promise = require('bluebird')
const fs = require('fs-extra')
const {dest} = require('gulp')
const yaml = require('js-yaml')
const _ = {
	pickBy: require('lodash.pickby')
}
const semver = require('semver')
const {Readable: ReadableStream} = require('stream')
const Vinyl = require('vinyl')

const METADATA_FILE = 'node_modules/@fortawesome/fontawesome-free/metadata/icons.yml'

async function read() {
	return yaml.safeLoad(await fs.readFile(METADATA_FILE, 'utf8'))
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
 * Categorize icons by styles supported.
 */
function process(metadata) {
	let result = {regular: {}, solid: {}, brands: {}}
	Object.keys(metadata).forEach(icon => {
		let styles = metadata[icon].styles
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
	const metadata = process(filter(await read()))
	return output(metadata)
}

module.exports = generateMetadata
