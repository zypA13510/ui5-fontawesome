'use strict'

const {expect} = require('chai')
	.use(require('chai-as-promised'))
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

const STYLES = [
	'brands',
	'solid',
	'regular',
]

describe('generated metadata', () => {
	STYLES.forEach(style => {
		context(style, () => {
			let fileName, fileContent, icons
			before(async () => {
				icons = await new Promise((resolve, reject) => {
					glob(`node_modules/@fortawesome/fontawesome-free/svgs/${style}/*.svg`, (err, files) => {
						if (err) {
							return reject(err)
						} else {
							return resolve(files.map(fileName => path.basename(fileName, '.svg')))
						}
					})
				})
			})
			
			it('should have a metadata file for the style', () => {
				expect(() => fileName = require.resolve(`../metadata/${style}.json`))
					.to.not.throw()
			})
			
			it('should be a valid json object', async () => {
				await expect((async () => fileContent = await fs.readJson(fileName))())
					.to.be.fulfilled
				expect(fileContent).to.be.an('object')
			})
			
			it('should have a length that equals the number of icons', async () => {
				expect(Object.keys(fileContent)).to.have.a.lengthOf(icons.length)
			})
			
			it('should have an entry for every icon with the same name', async () => {
				expect(fileContent).to.have.keys(icons)
			})
			
			it('should use hexadecimal strings as entrypoint values', () => {
				Object.values(fileContent).every(value => {
					expect(value).to.be.a('string').that.matches(/[0-9A-Fa-f]+/)
				})
			})
		})
	})
})
