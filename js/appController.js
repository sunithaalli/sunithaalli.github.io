/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define([
'./jq/JQLanguageDef',
'ojs/ojcontext', 
'ojs/ojresponsiveutils', 
'ojs/ojresponsiveknockoututils', 
'knockout', 
'./swagger/swaggerParser',
'./trees/sourceTreeView',
'./trees/targetTreeView',
'./expressions/expressionsView',
'./splitPane',
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
'vs/editor/editor.main'],
  function(
    JQLanguageDef, Context, ResponsiveUtils, ResponsiveKnockoutUtils, ko, SwaggerParser, SourceTreeView, TargetTreeView, ExpressionsView, splitPane) {

      const mockExpressions = [
        {
          id: 'e1',
          targetName: 'foo',
          expression: '.x.y',
        },
        {
          id: 'e2',
          targetName: 'soo',
          expression: '"new value"',
        },
        {
          id: 'e3',
          targetName: 'bar',
          expression: '.z',
          context: ' | map',
          children: [{
            id: 'e3:1',
            targetName: 'newcomment',
            expression: '.comments',
          },
          {
            id: 'e3_2',
            targetName: 'newTitle',
            expression: '.title',
          }]
        },
      ];

      const mockSchemaExpressions = [
        {
          id: 'e1',
          targetName: 'id',
          expression: '.["request-wrapper"].orderId',
        },
        {
          id: 'e2',
          targetName: 'title',
          expression: '.["request-wrapper"].orderName',
        },
        {
          id: 'e3',
          targetName: 'status',
          expression: '.["request-wrapper"].orderStatus',
        },
        {
          id: 'e4',
          targetName: 'invoices',
          expression: '.["request-wrapper"].billOfLines',
          context: ' | map',
          children: [{
            id: 'e4_1',
            targetName: 'invoiceId',
            expression: '.billLineId',
          },
          {
            id: 'e4_2',
            targetName: 'usageQuantity',
            expression: '.totalUsage',
          },
          {
            id: 'e4_3',
            targetName: 'invoiceDescription',
            expression: '("Bill Id Number: " + .billLineId)',
          }]
        }
      ];

     class ControllerViewModel {
      constructor() {
        // Media queries for repsonsive layouts
        const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
        this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

        // Header
        // Application Name used in Branding Area
        this.appName = ko.observable('JQ Web Implementation Test');
        // User Info used in Global Navigation area
        this.userLogin = ko.observable('sunitha.alli@oracle.com');

        this.generatedJQFilter = ko.observable('');
        this.schemaMode = ko.observable(true);
        this.sourceMappingMode = ko.observable(false);
        this.swaggerParser = new SwaggerParser();

        // register JQ Language definition with monaco
        this.registerJQLanguageDefinitionWithMonaco();

        this.showGeneratedJQ = this.showGeneratedJQ.bind(this);
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
        this.sourceTreeView = new SourceTreeView(document.getElementById('inputTreeViewContainer'),
          this.schemaMode, this.sourceMappingMode, this.swaggerParser.orderSwagger, '$.components.schemas.executeType..endpointRequest');

        // shapeless mode
        if(this.inputJsonShapelessSubscribe) {
          this.inputJsonShapelessSubscribe.dispose();
        }

        this.inputJsonShapeless = this.sourceTreeView.inputJsonShapelessBinding;
        this.inputJsonShapelessSubscribe =  this.inputJsonShapeless.subscribe(() => {
          this.runJQFilter(2);
        });

        // schema mode
        if(this.jsonPayloadForSchemaSubscribe) {
          this.jsonPayloadForSchemaSubscribe.dispose();
        }

        this.jsonPayloadForSchema = this.sourceTreeView.jsonPayloadForSchemaBinding;
        this.jsonPayloadForSchemaSubscribe = this.jsonPayloadForSchema.subscribe(async (newValue) => {
          this.expressionsView.payloadForValidation = newValue;
          const output = await this.expressionsView.runJQFilterOnSourcePayload(newValue);
          this.targetTreeView.targetOutputJsonBinding(output);
          this.generatedJQFilter(this.expressionsView.generatedJQExpression);
        });

        // target tree
        this.targetTreeView = new TargetTreeView(document.getElementById('outputTreeViewContainer'),
          this.schemaMode, this.sourceMappingMode, this.swaggerParser.taskSwagger, '$.components.schemas..executeResponseType');
        this.outputJsonShapeless = this.targetTreeView.outputJsonShapelessBinding;

        this.targetDragContext = this.targetTreeView.dragContextBinding;
        this.sourceDragContext = this.sourceTreeView.dragContextBinding;

        this.targetDragContextTypes = this.targetTreeView.dragContextTypesBinding;
        this.sourceDragContextTypes = this.sourceTreeView.dragContextTypesBinding;

        // initial mock 
        if (!this.schemaMode()) {
          window.setTimeout(() => this.runJQFilter(2), 300);
        }
      }

      async _generateTargetJsonOutput() {
        const output = await this.expressionsView.runJQFilterOnSourcePayload(this.jsonPayloadForSchema());
        this.targetTreeView.targetOutputJsonBinding(output);
        this.generatedJQFilter(this.expressionsView.generatedJQExpression);
      }
      /**
       * Initializes the entire UI
       */
      async initUi() {
        await this.swaggerParser.loadMockSwaggers();

        this.initSplitters();
        this.schemaMode.subscribe(() => {
          this.initTrees();
        })

        this.initTrees();
        const expressions = this.schemaMode() ? mockSchemaExpressions : mockExpressions
        const expressionsViewContainer = document.getElementById('expressionsViewContainer');
        this.expressionsView = new ExpressionsView(expressionsViewContainer, this.schemaMode, this.sourceMappingMode, 
          this.targetDragContext, this.sourceDragContext, this.targetDragContextTypes, this.sourceDragContextTypes, expressions);
        
        expressionsViewContainer.addEventListener('generateSourcePayload', async () => {
          this.sourceTreeView.generateJsonPayload();
        });

        expressionsViewContainer.addEventListener('generateTargetJsonOutput', async () => {
          await this._generateTargetJsonOutput();
        });

        this.sourceMappingMode.subscribe(async (value) => {
          if (value) {
            await this.sourceTreeView.generateJsonPayload();
            await this._generateTargetJsonOutput();
          }
        })
      }

      showGeneratedJQ() {
        document.getElementById('showGeneratedJQ').open();
      }

      runJQFilter(id) {
        try{
          const inputJsonShapelessObj = JSON.parse(this.inputJsonShapeless());
          const inputFilter = this[`jqFilter${id}`]();

          jq.promised.json(inputJsonShapelessObj, inputFilter).then((resultObject) => {

            let jsonData = JSON.stringify(resultObject, null, 2);
            this.targetTreeView.updateTargetShapelessOuput(jsonData);
          }, (e) => {
            let errMessage = e.message;
            errMessage += '\n\n' + e.stack;
            this.targetTreeView.updateTargetShapelessOuput(jsonData);
          });
          
        } catch(e) {
          this.targetTreeView.updateTargetShapelessOuput(e.toString());
        }
      }

      registerJQLanguageDefinitionWithMonaco(){
        // Register jq language
        monaco.languages.register({ id: 'jq' });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('jq', JQLanguageDef);
      }
    }

     // release the application bootstrap busy state
     Context.getPageContext().getBusyContext().applicationBootstrapComplete();

     return new ControllerViewModel();
  }
);
