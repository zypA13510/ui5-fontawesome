function printFontAwesomeVersion(cb) {
	let {version: installedVersion} = require('@fortawesome/fontawesome-free/package.json')
	process.stdout.write(`Built with Font Awesome free ${installedVersion}` + '\n', 'ascii', cb)
}

module.exports = printFontAwesomeVersion
