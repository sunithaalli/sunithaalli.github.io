define([
  '../jq/JQLanguageDef',
  'knockout', 
  'swagger-client',
  '../trees/sourceTreeView',
  '../trees/targetTreeView',
  '../expressions/expressionsView',
  '../splitPane',
  'ojs/ojknockout',
  "ojs/ojbutton", 
  "ojs/ojinputtext",
  "ojs/ojswitch",
  'ojs/ojmodule-element',
  'ojs/ojnavigationlist',
  'ojs/ojlistview',
  'ojs/ojlistitemlayout',
  'ojs/ojtable',
  'ojs/ojtreeview',
  'ojs/ojaccordion',
  'ojs/ojselectcombobox',
  'ojs/ojrowexpander',
  'ojs/ojswitcher',
  '../vs/editor/editor.main'],
  function(
    JQLanguageDef, ko, SwaggerClient, SourceTreeView, TargetTreeView, ExpressionsView, splitPane) {
      class JsonMapper {
        constructor({properties, element}) {
          this.properties = properties;
          this.expressionModel = this.properties.expressionModel;
          this.element = element;
          this.schemaMode = ko.observable(properties.schemaMode);
          this.sourceMappingMode = ko.observable(properties.sourceMappingMode);
          this.generatedJQFilter = ko.observable('');
          // register JQ Language definition with monaco
          this.registerJQLanguageDefinitionWithMonaco();
        }

        /**
         * Initializes the different inputs needed by json mapper
         */
        async initInputs() {
          if(this.schemaMode()) {

            if (this.properties.sourceRootPath) {
              this.sourceSwaggerOrSchemaNode = await SwaggerClient.resolve({spec: JSON.parse(this.properties.sourceSwaggerOrSchema)});
            } else {
              this.sourceSwaggerOrSchemaNode = JSON.parse(this.properties.sourceSwaggerOrSchema);
            }
            

            // load target only if needed
            if (!this.sourceMappingMode()) {
              if (this.properties.targetRootPath) {
                this.targetSwaggerOrSchema = await SwaggerClient.resolve({spec: JSON.parse(this.properties.targetSwaggerOrSchema)});
              } else {
                this.targetSwaggerOrSchema = JSON.parse(this.properties.targetSwaggerOrSchema);
              }
            }
          }
        }

        /**
         * Initializes the splitter
         */
        initSplitters(){
          splitPane.split(['inputTreeViewContainer', 'expressionsViewContainer', 'outputTreeViewContainer'],
                          { direction: "horizontal",
                            gutterSize: 5,
                            minSize: 200,
                            snapOffset: 20,
                            sizes: [25, 50,  25],
                            role: "expressionGutter" });
        }

        /**
         * Initializes the treeViews
         */
        initTrees() {
          this.sourceTreeView = new SourceTreeView(this.element.querySelector('#inputTreeViewContainer'),
            this.schemaMode, this.sourceMappingMode, this.sourceSwaggerOrSchemaNode, this.properties.sourceRootPath);

          
          // schema mode
          this.jsonPayloadForSchema = this.sourceTreeView.jsonPayloadForSchemaBinding;
          this.jsonPayloadForSchemaSubscribe = this.jsonPayloadForSchema.subscribe(async (newValue) => {
            this.expressionsView.payloadForValidation = newValue;
            const output = await this.expressionsView.runJQFilterOnSourcePayload(newValue);
            this.targetTreeView.targetOutputJsonBinding(output);
            this.generatedJQFilter(this.expressionsView.generatedJQExpression);
          });

          // target tree
          this.targetTreeView = new TargetTreeView(this.element.querySelector('#outputTreeViewContainer'),
            this.schemaMode, this.sourceMappingMode, this.targetSwaggerOrSchema, this.properties.targetRootPath);

          this.targetDragContext = this.targetTreeView.dragContextBinding;
          this.sourceDragContext = this.sourceTreeView.dragContextBinding;

          this.targetDragContextTypes = this.targetTreeView.dragContextTypesBinding;
          this.sourceDragContextTypes = this.sourceTreeView.dragContextTypesBinding;

          // shapeless mode
          /* 
          this.outputJsonShapeless = this.targetTreeView.outputJsonShapelessBinding;

          if(this.inputJsonShapelessSubscribe) {
            this.inputJsonShapelessSubscribe.dispose();
          }

          this.inputJsonShapeless = this.sourceTreeView.inputJsonShapelessBinding;
          this.inputJsonShapelessSubscribe =  this.inputJsonShapeless.subscribe(() => {
            // this.runJQFilter(2);
          });
          */


          // initial mock 
          if (!this.schemaMode()) {
            // window.setTimeout(() => this.runJQFilter(2), 300);
          }
        }

        /**
         * Initializes the treeViews
         */
         initExpressionView() {
          const expressionsViewContainer = this.element.querySelector('#expressionsViewContainer');
          this.expressionsView = new ExpressionsView(expressionsViewContainer, this.schemaMode, this.sourceMappingMode, 
            this.targetDragContext, this.sourceDragContext, this.targetDragContextTypes, 
            this.sourceDragContextTypes, this.expressionModel, this.properties.expressionRootNodeName);
          
          expressionsViewContainer.addEventListener('generateSourcePayload', async () => {
            this.sourceTreeView.generateJsonPayload();
          });

          expressionsViewContainer.addEventListener('generateTargetJsonOutput', async () => {
            await this._generateTargetJsonOutput();
          });
         }

         async _generateTargetJsonOutput() {
          const output = await this.expressionsView.runJQFilterOnSourcePayload(this.jsonPayloadForSchema());
          this.targetTreeView.targetOutputJsonBinding(output);
          this.generatedJQFilter(this.expressionsView.generatedJQExpression);
        }

        registerJQLanguageDefinitionWithMonaco(){
          // Register jq language
          monaco.languages.register({ id: 'jq' });
  
          // Register a tokens provider for the language
          monaco.languages.setMonarchTokensProvider('jq', JQLanguageDef);
        }

        /**
         * CCA lifecycle method
         * @param {*} context 
         */
        async connected(context) {
          await this.initInputs();
          this.initSplitters();
          this.initTrees();
          this.initExpressionView();
        }

        /**
         * CCA lifecycle method
         */
        async disconnected() {
          if(this.jsonPayloadForSchemaSubscribe) {
            this.jsonPayloadForSchemaSubscribe.dispose();
          }
        }

        async saveChanges() {
          await this.sourceTreeView.generateJsonPayload();
          await this._generateTargetJsonOutput();
          this.properties.outputJQExpression = this.generatedJQFilter();
          this.properties.expressionModel = this.expressionsView.getExpressionArray();
          this.properties.expressionRootNodeName = this.expressionsView.rootNode();
        }
      }
      return JsonMapper;
  }
);