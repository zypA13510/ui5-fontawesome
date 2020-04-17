'use strict'

const assert = require('assert')
const {expect} = require('chai')
	.use(require('sinon-chai'))
const fs = require('fs-extra')
const glob = require('glob')
const initJQuery = require('jquery')
const {JSDOM} = require('jsdom')
const path = require('path')
const sinon = require('sinon')
const ui5Loader = require('ui5-simple-require')

const STYLES = [
	'brands',
	'solid',
	'regular',
]

function initGlobal(dom) {
	let {window} = dom
	global.window = window
	global.document = window.document
	let jQuery = initJQuery(window)
	global.jQuery = jQuery
	sinon.stub(jQuery, 'ajax').callsFake((fileName, {success}) => {
		fs.readJson(fileName, (err, data) => {
			if (err) {
				console.error(err)
			} else {
				success(/* data: */data, /* textStatus: */'success'/* , jqXHR: undefined */)
			}
		})
	})
}

function clearGlobal() {
	sinon.restore()
	delete global.jQuery
	delete global.document
	delete global.window
}

describe('js entrypoint', () => {
	let requirePath
	
	it('should exist on disk', () => {
		expect(() => requirePath = require.resolve('../js/ui5-fontawesome.js'))
			.to.not.throw()
	})
	
	context('when invoked', () => {
		let IconPoolStub
		beforeEach(() => {
			IconPoolStub = class IconPool {}
			ui5Loader.inject('sap/ui/core/IconPool', IconPoolStub)
		})
		afterEach(() => {
			ui5Loader.clearInjection()
		})
		
		context('when invoked without data-resourceroot with implicit path', () => {
			beforeEach(() => {
				/* eslint-disable indent */
				initGlobal(new JSDOM(`
<!DOCTYPE html>
<html>
<body>
	<script id="ui5-fontawesome" src="${requirePath.replace(path.sep, '/')}"></script>
</body>
</html>
				`))
				/* eslint-enable indent */
			})
			afterEach(() => {
				clearGlobal()
			})
			
			context('if on 1.56 and later where IconPool.registerFont exists', () => {
				beforeEach(() => {
					IconPoolStub.registerFont = sinon.fake()
					IconPoolStub.addIcon = sinon.fake()
				})
				afterEach(() => {
					sinon.restore()
				})
				
				it('should always call IconPool.registerFont with an object matching the signature', () => {
					IconPoolStub.registerFont = sinon.fake(function(oConfig) {
						assert(arguments.length === 1 && oConfig instanceof Object)
						assert(Object.keys(oConfig).every(key => [
							'fontFamily',
							'collectionName',
							'fontURI',
							'metadata',
							'metadataURI',
							'lazy',
						].includes(key)))
						let {
							fontFamily,
							collectionName,
							fontURI,
							metadata,
							metadataURI,
							lazy,
						} = oConfig
						assert(typeof fontFamily == 'string')
						assert(typeof collectionName == 'string')
						assert(typeof fontURI == 'string' || fontURI instanceof Object)
						assert(typeof metadata == 'undefined' || metadata instanceof Object)
						assert(['undefined', 'string'].includes(typeof metadataURI) || metadataURI instanceof Object)
						assert(['undefined', 'boolean'].includes(typeof lazy))
						assert(this === IconPoolStub)
					})
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.registerFont).to.not.have.thrown()
				})
				
				it('should call IconPool.registerFont, once for every style', () => {
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.registerFont).to.have.been.called
						.and.have.callCount(STYLES.length)
				})
				
				it('should call IconPool.registerFont with collectionName: fa-<style>', () => {
					IconPoolStub.registerFont = sinon.fake(({collectionName}) => collectionName)
					ui5Loader.ui5require(requirePath)
					STYLES.forEach(style => {
						let collectionName = `fa-${style}`
						expect(IconPoolStub.registerFont).to.have.returned(collectionName)
					})
				})
				
				it('should call IconPool.registerFont with the correct fontURI', () => {
					IconPoolStub.registerFont = sinon.fake(({fontURI}) => fontURI.replace(/\/$/, ''))
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.registerFont).to.have.always.returned(
						path.resolve(__dirname, '../fontawesome-free/webfonts')
					)
				})
				
				it('should call IconPool.registerFont with the correct path to metadata', () => {
					IconPoolStub.registerFont = sinon.fake(({metadataURI}) => metadataURI)
					ui5Loader.ui5require(requirePath)
					STYLES.forEach(style => {
						let metadataURI = require.resolve(`../metadata/${style}.json`)
						expect(IconPoolStub.registerFont).to.have.returned(metadataURI)
					})
				})
				
				it('should not call IconPool.addIcon directly', () => {
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.addIcon).to.not.have.been.called
				})
			})
			
			context('if on versions before 1.56', () => {
				const ADDICON_TIMEOUT = 1000
				beforeEach(() => {
					IconPoolStub.addIcon = sinon.fake()
				})
				afterEach(() => {
					sinon.restore()
				})
				
				it('should always call IconPool.addIcon with arguments matching call signature', async () => {
					IconPoolStub.addIcon = sinon.fake(function(iconName, collectionName, iconInfo) {
						assert(arguments.length == 3)
						assert(typeof iconName === 'string')
						assert(typeof collectionName === 'string')
						assert(iconInfo instanceof Object)
						assert(Object.keys(iconInfo).every(key => [
							'fontFamily',
							'content',
							'overWrite',
							'suppressMirroring',
							'resourceBundle',
						].includes(key)))
						let {
							fontFamily,
							content,
							overWrite,
							suppressMirroring,
							resourceBundle,
						} = iconInfo
						assert(typeof fontFamily === 'string')
						assert(typeof content === 'string'
							|| (content instanceof Array && content.every(
								member => typeof member === 'string'
							)))
						assert(['undefined', 'boolean'].includes(typeof overWrite))
						assert(['undefined', 'boolean'].includes(typeof suppressMirroring))
						assert(typeof resourceBundle === 'undefined' || resourceBundle instanceof Object)
						assert(this === IconPoolStub)
					})
					ui5Loader.ui5require(requirePath)
					await new Promise(resolve => setTimeout(resolve, ADDICON_TIMEOUT))
					expect(IconPoolStub.addIcon).to.not.have.thrown()
				})
				
				it('should call IconPool.addIcon, once for each icon', async () => {
					let totalIconCount = new Promise((resolve, reject) => {
						glob('node_modules/@fortawesome/fontawesome-free/svgs/**/*.svg', (err, files) => {
							if (err) {
								return reject(err)
							} else {
								return resolve(files.length)
							}
						})
					})
					ui5Loader.ui5require(requirePath)
					totalIconCount = await totalIconCount
					let timer
					let timeout = new Promise((resolve, reject) => setTimeout(() => {
						clearTimeout(timer)
						reject(new Error('Timed out waiting for condition to be satisfied'))
					}, ADDICON_TIMEOUT))
					let testUntilSatisfy = new Promise(resolve => {
						(function test() {
							try {
								expect(IconPoolStub.addIcon).to.have.been.called
									.and.have.callCount(totalIconCount)
							} catch (e) {
								return timer = setTimeout(test, 10)
							}
							resolve()
						})()
					})
					await Promise.race([timeout, testUntilSatisfy])
				})
				
				it('should call IconPool.addIcon with original iconName', async () => {
					let iconNames = await new Promise((resolve, reject) => {
						glob('node_modules/@fortawesome/fontawesome-free/svgs/**/*.svg', (err, files) => {
							if (err) {
								return reject(err)
							} else {
								return resolve(files.map(fileName => path.basename(fileName, '.svg')))
							}
						})
					})
					IconPoolStub.addIcon = sinon.fake(function(iconName) {
						return iconNames.includes(iconName)
					})
					ui5Loader.ui5require(requirePath)
					await new Promise(resolve => setTimeout(resolve, ADDICON_TIMEOUT))
					expect(IconPoolStub.addIcon).to.not.have.returned(false)
				})
				
				it('should call IconPool.addIcon with collectionName: fa-<style>', async () => {
					let collectionNames = STYLES.map(style => `fa-${style}`)
					IconPoolStub.addIcon = sinon.fake(function(iconName, collectionName) {
						return collectionNames.includes(collectionName)
					})
					ui5Loader.ui5require(requirePath)
					await new Promise(resolve => setTimeout(resolve, ADDICON_TIMEOUT))
					expect(IconPoolStub.addIcon).to.not.have.returned(false)
				})
				
				it('should add font-face style tags for each style', () => {
					ui5Loader.ui5require(requirePath)
					let fontFaceCount = 0
					for (let styleSheet of global.document.styleSheets) {
						if (styleSheet.cssRules) {
							for (let cssRule of styleSheet.cssRules) {
								if (cssRule.type === global.window.CSSRule.FONT_FACE_RULE) {
									fontFaceCount++
								}
							}
						}
					}
					expect(fontFaceCount).to.equal(STYLES.length)
				})
				
				it('should call IconPool.addIcon with the same font-family as added font-face', async () => {
					let fontFamilies = new Set()
					IconPoolStub.addIcon = sinon.fake(function(iconName, collectionName, {fontFamily}) {
						return fontFamilies.has(fontFamily)
					})
					ui5Loader.ui5require(requirePath)
					for (let styleSheet of global.document.styleSheets) {
						if (styleSheet.cssRules) {
							for (let cssRule of styleSheet.cssRules) {
								if (cssRule.type === global.window.CSSRule.FONT_FACE_RULE) {
									let fontFamily = cssRule.style['font-family']
									if (typeof fontFamily === 'string') {
										fontFamilies.add(fontFamily.replace(/(^"|"$)/g, ''))
									}
								}
							}
						}
					}
					await new Promise(resolve => setTimeout(resolve, ADDICON_TIMEOUT))
					expect(IconPoolStub.addIcon).to.not.have.returned(false)
				})
			})
		})
	
		context('when invoked with data-resourceroot', () => {
			let resourceRoot
			beforeEach(() => {
				/* eslint-disable indent */
				initGlobal(new JSDOM(`
<!DOCTYPE html>
<html>
<body>
	<script
		id="ui5-fontawesome"
		src="https://example.com/path/js/ui5-fontawesome.min.js"
		data-resourceroot=${resourceRoot}>
	</script>
</body>
</html>
				`))
				/* eslint-enable indent */
				IconPoolStub.registerFont = sinon.fake()
			})
			afterEach(() => {
				sinon.restore()
				clearGlobal()
			})
			
			context('when data-resourceroot has trailing slash', () => {
				before(() => {
					resourceRoot = 'https://example.com/path/'
				})
				after(() => {
					resourceRoot = undefined
				})
				
				it('should call IconPool.registerFont with normalized fontURI', () => {
					IconPoolStub.registerFont = sinon.fake(({fontURI}) => fontURI)
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.registerFont).to.have.always.returned(
						'https://example.com/path/fontawesome-free/webfonts/'
					)
				})
			})
			
			context('when data-resourceroot has no trailing slash', () => {
				before(() => {
					resourceRoot = 'https://example.com/path'
				})
				after(() => {
					resourceRoot = undefined
				})
				
				it('should call IconPool.registerFont with normalized fontURI', () => {
					IconPoolStub.registerFont = sinon.fake(({fontURI}) => fontURI)
					ui5Loader.ui5require(requirePath)
					expect(IconPoolStub.registerFont).to.have.always.returned(
						'https://example.com/path/fontawesome-free/webfonts/'
					)
				})
			})
		})
		
		context('when invoked without data-resourceroot nor implicit path', () => {
			beforeEach(() => {
				/* eslint-disable indent */
				initGlobal(new JSDOM(`
<!DOCTYPE html>
<html>
<body>
	<script src="https://example.com/path/js/ui5-fontawesome.min.js"></script>
</body>
</html>
				`))
				/* eslint-enable indent */
			})
			afterEach(() => {
				clearGlobal()
			})
			
			it('should throw an error', () => {
				expect(() => ui5Loader.ui5require(requirePath)).to.throw()
			})
		})
		
		context('when invoked without adding the id to the script tag', () => {
			beforeEach(() => {
				/* eslint-disable indent */
				initGlobal(new JSDOM(`
<!DOCTYPE html>
<html>
<body>
	<script src="${requirePath.replace(path.sep, '/')}"></script>
</body>
</html>
				`))
				/* eslint-enable indent */
			})
			afterEach(() => {
				clearGlobal()
			})
			
			it('should throw an error', () => {
				expect(() => ui5Loader.ui5require(requirePath)).to.throw()
			})
		})
	})
})
