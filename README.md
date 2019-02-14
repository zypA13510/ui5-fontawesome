# ui5-fontawesome
A [Font Awesome](https://fontawesome.com/) plugin for [OpenUI5](https://openui5.org/)/SAPUI5

## Usage
1. Download the package and put it somewhere in your app folder (please keep the folder structure).
2. Add the following to your HTML after the bootstrapping of OpenUI5 (change `src` accordingly):
```HTML
<script
	src="../node_modules/ui5-fontawesome/js/ui5-fontawesome.min.js"
	id="ui5-fontawesome">
</script>
```
The `id="ui5-fontawesome"` is required. Additionally, if the folder is not named `ui5-fontawesome`, you need to specify the path to the package relative to the HTML file by adding a `data-resourceroot` attribute. For example:
```HTML
<script
	src="../not-ui5-fontawesome/js/ui5-fontawesome.min.js"
	id="ui5-fontawesome"
	data-resourceroot="../not-ui5-fontawesome/">
</script>
```
3. Use the font in UI5 application, adding `fa-brands`/`fa-regular`/`fa-solid` depending on your desired style (only free icon styles are supported at the moment):
```XML
<mvc:View
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:core="sap.ui.core">
	<core:Icon src="sap-icon://fa-brands/font-awesome" size="32px"/>
	<Button icon="sap-icon://fa-regular/closed-captioning"/>
	<StandardListItem icon="sap-icon://fa-solid/award" title="This is awesome."/>
</mvc:View>
```

## License
The code contained in this repository is licensed under MIT license.

Additionally, the distributed package contains part of the Font Awesome free package, you can find the license from [their repository](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt) or `fontawesome-free/LICENSE.txt` in your download.

This project is not endorsed by or affiliated with either Font Awesome or OpenUI5.
