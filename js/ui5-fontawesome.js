sap.ui.require([
	'sap/ui/core/IconPool'
], function(
	IconPool
) {
	
	function getResourceRoot() {
		var scriptTag = document.querySelector('SCRIPT[src][id=ui5-fontawesome]')
		var scriptConfig = scriptTag.getAttribute('data-resourceroot')
		if (scriptConfig) {
			return scriptConfig.slice(-1) == '/' ? scriptConfig : scriptConfig + '/'
		}
		var scriptSrc = scriptTag.getAttribute('src')
		var regexTest = /^((?:.*\/)?ui5-fontawesome\/)/
		var matched = regexTest.exec(scriptSrc)
		if (matched) {
			return matched[1]
		}
		throw new Error('Failed to determine resource root for ui5-fontawesome.')
	}
	
	var resourceRoot = getResourceRoot()
	var fontURI = resourceRoot + 'node_modules/@fortawesome/fontawesome-free/webfonts/'
	var styles = [{
		fontFamily: 'fa-regular-400',
		collectionName: 'fa-regular',
		metadataURI: resourceRoot + 'metadata/regular.json',
	}, {
		fontFamily: 'fa-solid-900',
		collectionName: 'fa-solid',
		metadataURI: resourceRoot + 'metadata/solid.json',
	}, {
		fontFamily: 'fa-brands-400',
		collectionName: 'fa-brands',
		metadataURI: resourceRoot + 'metadata/brands.json',
	}]
	if (typeof IconPool.registerFont == 'function') {
		// @since 1.56.0
		styles.forEach(function(style) {
			IconPool.registerFont(jQuery.extend({}, style, {
				fontURI: fontURI,
				lazy: true,
			}))
		})
	} else {
		styles.forEach(function(style) {
			// add icons to registry and insert the font style
			jQuery.ajax(style.metadataURI, {
				dataType: 'json',
				success: function(oFontMetadata) {
					for(var sKey in oFontMetadata) {
						IconPool.addIcon(sKey, style.collectionName, {
							fontFamily: style.fontFamily,
							content: oFontMetadata[sKey],
							overWrite: true,
						})
					}
				},
				error: function() {
					jQuery.sap.log.error('An error occurred loading the font metadata for collection "' + style.collectionName + '"')
				},
			})
			// load the font asynchronously via CSS
			var sFontFaceCSS = '@font-face {' +
					'font-family: "' + style.fontFamily + '";' +
					'src: url("' + fontURI + style.fontFamily + '.woff2") format("woff2"),' + /* Chrome 36+, Firefox 39+, Safari 10+, Edge 14+, Chrome 51+ for Android, PhantomJS 2.1.1+ */
					'url("' + fontURI + style.fontFamily + '.woff") format("woff"),' + /* IE9+, Safari 5.1+, iOS 5.1+, Android Browser 4.4+, IE Mobile 11+ */
					'url("' + fontURI + style.fontFamily + '.ttf") format("truetype"),' + /* Fallback for any older browser (except IE8 and below which are not supported anyway) */
					'local("' + style.fontFamily + '");' + /* fallback to local installed font in case it can't be loaded (e.g. font download is disabled due to browser security settings) */
					'font-weight: normal;' +
					'font-style: normal;' +
				'}'
			var oStyle = document.createElement('style')
			oStyle.type = 'text/css'
			oStyle.textContent = sFontFaceCSS
			document.head.appendChild(oStyle)
		})
	}
})
