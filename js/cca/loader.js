"use strict";
define(['ojs/ojcomposite', 'text!cca/jsonMapper.html', 'cca/jsonMapper', 'text!cca/jsonMapper.json',  'css!cca/jsonMapper.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('oic-json-mapper', {
      view,
      viewModel,
      metadata: JSON.parse(metadata),
    });
  }
);