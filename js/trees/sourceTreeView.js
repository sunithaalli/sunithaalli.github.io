define([
  'knockout',
  './baseTreeView',
  '../monaco/monacoEditor',
  'json-schema-faker/vendor',
  'json-schema-faker/main.iife',
  'text!./view/sourceTreeView.html'],
    (ko, BaseTreeView, MonacoEditor, jsfvendor, jsonfaker, sourceTreeViewHtml) => {
      const mockInputJson = ko.observable(JSON.stringify(JSON.parse(`{
        "x": {"y": 8},
        "z": [
            {
                "comments": ["One comment"],
                "title": "A post"
            }, {
                "comments": [],
                "title": "Another post"
            }
        ]
      }`), null, 2));

      class SourceTreeView extends BaseTreeView {
        constructor (domContainer, schemaMode, sourceMappingMode, sourceSwagger, rootPath) {
          super(domContainer, sourceTreeViewHtml, 'source-tree', schemaMode, 'application/sourceschemanodes+json');
          this._inputJsonShapeless = mockInputJson; // use mock data for the time being
          
          this.schemaTreeHeader = "Source";
          this.showSourceSchemaPayload = ko.observable(false);
          this._jsonPayloadForSchema = ko.observable('');

          if (!schemaMode()) {
            this.jsonTreeData = this.getTreeDataFromJsonBinding(this._inputJsonShapeless);
            MonacoEditor.setupEditor('json-payload-monaco-container', this._inputJsonShapeless);
          } else {
            this.schemaTreeData = this.getTreeDataFromSwaggerEndpoint(sourceSwagger, rootPath);
            this.showSourceSchemaPayload.subscribe((value) => {
              if (value) {
                window.setTimeout( () => {
                  this.generateJsonPayload();
                  MonacoEditor.setupEditor('source-schema-payload-monaco-container', this._jsonPayloadForSchema);
                }, 100);
              }
            });
          }
          this.initBinding(domContainer);
          
        }

        /**
         * Generates JSON payload used for running validations etc on JQ expressions. Also used to show the test output
         */
        generateJsonPayload() {
          jsonfaker.option({alwaysFakeOptionals: true});
          jsonfaker.option({fillProperties: false});
          const jsonData = jsonfaker.generate(this.schemaNode);
          this._jsonPayloadForSchema(JSON.stringify(jsonData, null, 2));
        }

        get inputJsonShapelessBinding() {
          return this._inputJsonShapeless;
        }

        get jsonPayloadForSchemaBinding() {
          return this._jsonPayloadForSchema;
        }
      }

      return SourceTreeView;
    }
)