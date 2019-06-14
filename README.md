<h1 align="center" style="border-bottom: none;">ui5-fontawesome</h1>
<h3 align="center">A <a href="https://fontawesome.com/">Font Awesome</a> plugin for <a href="https://openui5.org/">OpenUI5</a>/SAPUI5.</h3>
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
        <img alt="NPM download count" src="https://img.shields.io/npm/dw/ui5-fontawesome.svg?logo=npm&style=flat-square">
    </a>
    <a href="https://github.com/zypA13510/ui5-fontawesome/releases">
        <img alt="GitHub download count" src="https://img.shields.io/github/downloads/zypA13510/ui5-fontawesome/total.svg?logo=GitHub&style=flat-square">
    </a>
</p>
<p align="center">
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

## Changelog
See [CHANGELOG.md](CHANGELOG.md).

## License
The code contained in this repository is licensed under MIT license.

Additionally, the distributed package contains part of the Font Awesome free package, you can find the license from [their repository](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt) or `fontawesome-free/LICENSE.txt` in your download.

This project is not endorsed by or affiliated with either Font Awesome or OpenUI5.
