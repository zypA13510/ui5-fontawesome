# ui5-fontawesome

[![CircleCI status](https://img.shields.io/circleci/project/github/zypA13510/ui5-fontawesome/master.svg?logo=CircleCI&style=flat-square)](https://circleci.com/gh/zypA13510/ui5-fontawesome)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/zypA13510/ui5-fontawesome.svg?logo=Code%20Climate&style=flat-square)](https://codeclimate.com/github/zypA13510/ui5-fontawesome/maintainability)
[![NPM version](https://img.shields.io/npm/v/ui5-fontawesome.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/ui5-fontawesome)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/ui5-fontawesome.svg?logo=Snyk&style=flat-square)](https://snyk.io/test/github/zypA13510/ui5-fontawesome)
[![Greenkeeper enabled](https://img.shields.io/badge/Greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org/)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

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

## Changelog
See [CHANGELOG.md](CHANGELOG.md).

## License
The code contained in this repository is licensed under MIT license.

Additionally, the distributed package contains part of the Font Awesome free package, you can find the license from [their repository](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt) or `fontawesome-free/LICENSE.txt` in your download.

This project is not endorsed by or affiliated with either Font Awesome or OpenUI5.
