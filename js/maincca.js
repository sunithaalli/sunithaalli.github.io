/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

 // The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  
  requirejs.config(
    {
      baseUrl: 'js',

      paths:
      /* DO NOT MODIFY
      ** All paths are dynamicaly generated from the path_mappings.json file.
      ** Add any new library dependencies in path_mappings.json file
      */
// injector:mainReleasePaths

{
  "knockout":"libs/knockout/knockout-3.5.1.debug",
  "jquery":"libs/jquery/jquery-3.6.0",
  "jqueryui-amd":"libs/jquery/jqueryui-amd-1.13.0",
  "promise":"libs/es6-promise/es6-promise",
  "hammerjs":"libs/hammer/hammer-2.0.8",
  "swagger-client":"libs/swagger-client/swagger-client",
  "jsonpath":"jsonpath",
  "json-schema-faker":"libs/json-schema-faker",
  "vs":"libs/vs",
  "ojdnd":"libs/dnd-polyfill/dnd-polyfill-1.0.2",
  "ojs":"libs/oj/v13.0.2/debug",
  "ojL10n":"libs/oj/v13.0.2/ojL10n",
  "ojtranslations":"libs/oj/v13.0.2/resources",
  "@oracle/oraclejet-preact":"libs/oraclejet-preact/amd",
  "oj-c":"libs/packs/oj-c",
  "persist":"libs/persist/debug",
  "text":"libs/require/text",
  "signals":"libs/js-signals/signals",
  "preact":"libs/preact/dist/preact.umd",
  "preact/hooks":"libs/preact/hooks/dist/hooks.umd",
  "preact/compat":"libs/preact/compat/dist/compat.umd",
  "preact/jsx-runtime":"libs/preact/jsx-runtime/dist/jsxRuntime.umd",
  "preact/debug":"libs/preact/debug/dist/debug.umd",
  "preact/devtools":"libs/preact/devtools/dist/devtools.umd",
  "touchr":"libs/touchr/touchr",
  "regenerator-runtime":"libs/regenerator-runtime/runtime",
  "corejs":"libs/corejs/shim",
  "customElements":"libs/webcomponents/custom-elements.min",
  "proj4":"libs/proj4js/dist/proj4-src",
  "css":"libs/require-css/css",
  "ojcss":"libs/oj/v13.0.2/debug/ojcss",
  "ojs/ojcss":"libs/oj/v13.0.2/debug/ojcss",
  "css-builder":"libs/require-css/css-builder",
  "normalize":"libs/require-css/normalize",
  "ojs/normalize":"libs/require-css/normalize",
  "jet-composites":"jet-composites"
}

// endinjector
    }
  );
}());

/**
 * A top-level require call executed by the Application.
 * Although 'knockout' would be loaded in any case (it is specified as a  dependency
 * by some modules), we are listing it explicitly to get the reference to the 'ko'
 * object in the callback
 */
require(['ojs/ojbootstrap', 'knockout', 'appControllerCCA', 'cca/loader', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojmenu'],
  function (Bootstrap, ko, appCCA) { // this callback gets executed when all required modules are loaded

      Bootstrap.whenDocumentReady().then(
        function() {
          function init() {
            // Bind your ViewModel for the content of the whole page body.
            ko.applyBindings(appCCA, document.getElementById('globalBody'));
          }

          // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
          // event before executing any code that might interact with Cordova APIs or plugins.
          if (document.body.classList.contains('oj-hybrid')) {
            document.addEventListener("deviceready", init);
          } else {
            init();
          }
        }
      );
    }
);
