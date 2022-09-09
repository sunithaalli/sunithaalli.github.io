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
  'knockout', 
  'ojs/ojcontext',
  './monaco/monacoEditor',
  'swagger-client',
  'jsonpath',
  'text!./swagger/json/openapi_order.json',
  'text!./swagger/json/openapi_task.json',
  'ojs/ojformlayout',
  'ojs/ojbutton', 
  'ojs/ojswitch',
  ],
    (ko, Context, MonacoEditor, SwaggerClient, jsonpath, sourceSwaggerContent, targetSwaggerContent) => {
  
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
          this.sourceSwaggerContent = ko.observable(sourceSwaggerContent);
          this.targetSwaggerContent = ko.observable(targetSwaggerContent);
          this.sourceRootPath = ko.observable('$.components.schemas.executeType..endpointRequest');
          this.targetRootPath = ko.observable('$.components.schemas..executeResponseType');
          this.expressionRootNode = ko.observable('response-wrapper');
          this.schemaMode = ko.observable(true);
          this.sourceMappingMode = ko.observable(false);
          this.swagger = ko.observable(true);
          this.expressionModel = ko.observableArray(mockSchemaExpressions);
          this.expressionModelJson = ko.observable(JSON.stringify(mockSchemaExpressions, null, 2));
          this.outputJQExpression = ko.observable('');
          this.toggleTestHarness = this.toggleTestHarness.bind(this);
          this._setupMonacoEditors();
  
          this.showCCA = ko.observable(false);
          this.showCCA.subscribe(async (value) => {
            // coming back reset the monaco editors
            if (!value) {
              await this._saveCCA();
              window.setTimeout(() => {
                document.querySelector('#sourceSwaggerContent').innerHTML = '';
                document.querySelector('#targetSwaggerContent').innerHTML = '';
                document.querySelector('#expressionModelJson').innerHTML = '';
                this._setupMonacoEditors();
              }, 100);
            } else {
              // going into the CCA try to set the value of the expression model
              try {
                const modelJson = this.expressionModelJson() || '[]';
                this.expressionModel(JSON.parse(modelJson));
              } catch(e) {
                alert(`Error Parsing Expression Model: ${e.messsage}`)
              }
            }
          });

          this.swagger.subscribe(async (value) => {
            if (value) {
              this.sourceSwaggerContent(sourceSwaggerContent);
              this.targetSwaggerContent(targetSwaggerContent);
              this.sourceRootPath('$.components.schemas.executeType..endpointRequest');
              this.targetRootPath('$.components.schemas..executeResponseType');
            } else {
              const sourceNode = jsonpath.query(JSON.parse(sourceSwaggerContent), '$.components.schemas.executeType..endpointRequest', 1)[0];
              const targetNode = jsonpath.query(JSON.parse(targetSwaggerContent), '$.components.schemas..executeResponseType', 1)[0];
              this.sourceSwaggerContent(JSON.stringify(sourceNode, null, 2));
              this.targetSwaggerContent(JSON.stringify(targetNode, null, 2));
              this.sourceRootPath('');
              this.targetRootPath('');
            }

            document.querySelector('#sourceSwaggerContent').innerHTML = '';
            document.querySelector('#targetSwaggerContent').innerHTML = '';
            document.querySelector('#expressionModelJson').innerHTML = '';
            this._setupMonacoEditors();
          });
        }
  
        async _saveCCA() {
          const cca = document.querySelector('#jsonSchemaMapper');
          await cca.saveChanges();
          this.outputJQExpression(cca.outputJQExpression);
          this.expressionModelJson = ko.observable(JSON.stringify(cca.expressionModel, null, 2));
          this.expressionModel(cca.expressionModel);
          this.expressionRootNode(cca.expressionRootNodeName);
        }
  
        _setupMonacoEditors() {
          MonacoEditor.setupEditor('sourceSwaggerContent', this.sourceSwaggerContent);
          MonacoEditor.setupEditor('targetSwaggerContent', this.targetSwaggerContent);
          MonacoEditor.setupEditor('expressionModelJson', this.expressionModelJson);
        }
  
        toggleTestHarness() {
          this.showCCA(!this.showCCA());
        }
      }
  
       // release the application bootstrap busy state
       Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  
       return new ControllerViewModel();
    }
  );
  