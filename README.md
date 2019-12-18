<h1 align="center" style="border-bottom: none;">ui5-fontawesome</h1>
<p align="center">A <a href="https://fontawesome.com/">Font Awesome</a> plugin for <a href="https://openui5.org/">OpenUI5</a>/SAPUI5.</p>
<p align="center">
    <a href="https://circleci.com/gh/zypA13510/ui5-fontawesome">
        <img alt="CircleCI build status" src="https://img.shields.io/circleci/project/github/zypA13510/ui5-fontawesome/master.svg?logo=CircleCI&style=flat-square">
    </a>
    <a href="https://codeclimate.com/github/zypA13510/ui5-fontawesome/maintainability">
        <img alt="Code Climate maintainability rating" src="https://img.shields.io/codeclimate/maintainability/zypA13510/ui5-fontawesome.svg?logo=Code-Climate&style=flat-square">
    </a>
    <a href="https://snyk.io/test/npm/ui5-fontawesome">
        <img alt="Snyk known vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/npm/ui5-fontawesome.svg?logo=Snyk&style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/ui5-fontawesome">
        <img alt="NPM download count" src="https://img.shields.io/npm/dm/ui5-fontawesome.svg?logo=npm&style=flat-square">
    </a>
    <a href="https://www.jsdelivr.com/package/npm/ui5-fontawesome">
        <img alt="jsDelivr hits" src="https://img.shields.io/jsdelivr/npm/hm/ui5-fontawesome.svg?logo=jsdelivr&style=flat-square">
    </a>
    <a href="https://github.com/zypA13510/ui5-fontawesome/releases">
        <img alt="GitHub download count" src="https://img.shields.io/github/downloads/zypA13510/ui5-fontawesome/total.svg?logo=GitHub&style=flat-square">
    </a>
    <br>
    <a href="https://www.npmjs.com/package/ui5-fontawesome">
        <img alt="NPM version" src="https://img.shields.io/npm/v/ui5-fontawesome.svg?logo=npm&style=flat-square">
    </a>
    <a href="https://greenkeeper.io/">
        <img alt="Greenkeeper enabled" src="https://img.shields.io/badge/Greenkeeper-enabled-brightgreen.svg?logo=Greenkeeper&style=flat-square">
    </a>
    <a href="https://github.com/semantic-release/semantic-release">
        <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
    </a>
    <a href="https://conventionalcommits.org/">
        <img alt="Conventional Commits" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square">
    </a>
    <a href="http://commitizen.github.io/cz-cli/">
        <img alt="commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
    </a>
</p>


## Usage
### Bootstrapping
#### Hosting On-Premise
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
#### Bootstrapping from CDN
Add one of the following to your HTML after the bootstrapping of OpenUI5. **Note:** It is advised to specify at least a major version to avoid breaking your app, change `^1` to your desired [semver range](https://docs.npmjs.com/misc/semver#ranges) accordingly. Additionally, you may want to pinpoint a specific version if you wish to use [SRI check](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
##### jsDelivr
```HTML
<script
  src="https://cdn.jsdelivr.net/npm/ui5-fontawesome@^1/js/ui5-fontawesome.min.js"
  id="ui5-fontawesome"
  data-resourceroot="https://cdn.jsdelivr.net/npm/ui5-fontawesome@^1/">
</script>
```
##### UNPKG
```HTML
<script
  src="https://unpkg.com/ui5-fontawesome@^1/js/ui5-fontawesome.min.js"
  id="ui5-fontawesome"
  data-resourceroot="https://unpkg.com/ui5-fontawesome@^1/">
</script>
```
### Use in Views and Controllers
To use the font in UI5 application, prepend `fa-brands`/`fa-regular`/`fa-solid`, depending on your desired style, to the [icon name](https://fontawesome.com/icons) (only free icon-style combinations are supported):
```XML
<mvc:View
  xmlns="sap.m"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns:core="sap.ui.core">
  <core:Icon src="sap-icon://fa-brands/font-awesome" size="2.5rem" color="#339AF0" class="sapUiTinyMargin"/>
  <Button icon="sap-icon://fa-regular/closed-captioning" class="sapUiTinyMargin"/>
  <StandardListItem icon="sap-icon://fa-solid/award" title="This is awesome."/>
</mvc:View>
```
```JavaScript
sap.ui.define([
  'sap/ui/core/Icon'
], function(
  Icon
) {
  return new Icon({
    src: 'sap-icon://fa-brands/font-awesome',
    size: '2.5rem',
    color: '#339AF0'
  });
});
```

## Changelog
See [CHANGELOG.md](CHANGELOG.md).

## License
MIT

The distributed package includes the following components that are subject to separate license terms:

Font Awesome Free  
Author: Fonticons Inc. (https://fontawesome.com/)  
License: Font Awesome Free License (see `node_modules/@fortawesome/fontawesome-free/LICENSE.txt`)

This project is not endorsed by or affiliated with either Font Awesome or OpenUI5.
