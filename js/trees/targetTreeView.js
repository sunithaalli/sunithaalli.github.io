define([
  'knockout',
  './baseTreeView',
  '../monaco/monacoEditor',
  'text!./view/targetTreeView.html',
  'ojs/ojarraytreedataprovider',],
    (ko, BaseTreeView, MonacoEditor, targetTreeViewHtml, ArrayTreeDataProvider) => {
      class TargetTreeView extends BaseTreeView {
        constructor (domContainer, schemaMode, sourceMappingMode, targetSwaggerOrJsonSchema, rootPath) {
          super(domContainer, targetTreeViewHtml, 'target-tree', schemaMode, 'application/targetschemanodes+json');
          this._outputJsonShapeless = ko.observable('{}');
          this.schemaTreeHeader = "Target";
          this.showTargetOutput = ko.observable(sourceMappingMode());
          this._targetOutput = ko.observable('');

          if (!schemaMode()) {
            this.jsonTreeData = this.getTreeDataFromJsonBinding(this._outputJsonShapeless);
          } else {
            if (!targetSwaggerOrJsonSchema) {
              // dummy data for source Mode
              this.schemaTreeData = new ArrayTreeDataProvider([], {keyAttibutes: 'id'});
            } else {
              this.schemaTreeData = rootPath ? this.getTreeDataFromSwaggerEndpoint(targetSwaggerOrJsonSchema, rootPath)
                                    : this.getTreeDataFromSource(targetSwaggerOrJsonSchema, 'Target');
            }
            
            this.showTargetOutput.subscribe((value) => {
              if (value) {
                window.setTimeout( () => {
                  this.targetOutputMonacoEditor = MonacoEditor.setupEditor('target-output-monaco-container', this._targetOutput);
                }, 100);
              }
            });

            // initial display for source mapping mode
            if (sourceMappingMode()) {
              this._createTargetOutEditor();
            }

            this._targetOutput.subscribe((newOutput) => {
              // If the monaco editor is already created update the value
              if (this.targetOutputMonacoEditor) {
                this.targetOutputMonacoEditor.setValue(newOutput);
              }
            });
          }
          this.dropPopupText = ko.observable('');
          this.targetMonacoEditorShapless = undefined;
          this.handleDragStart = this._handleDragStart.bind(this);
          this.sourceMappingMode = sourceMappingMode;
          this.sourceMappingMode.subscribe((newValue) => {
            this.showTargetOutput(newValue);
          });
          this.initBinding(domContainer);
        }

        get targetOutputJsonBinding() {
          return this._targetOutput;
        }

        get outputJsonShapelessBinding() {
          return this._outputJsonShapeless;
        }

        /**
         * Creates the target output editor that displays the json output
         */
        _createTargetOutEditor() {
          window.setTimeout( () => {
            this.targetOutputMonacoEditor = MonacoEditor.setupEditor('target-output-monaco-container', this._targetOutput);
          }, 100);
        }

        updateTargetShapelessOuput(jsonData) {
          this._outputJsonShapeless(jsonData);
          if (!this.targetMonacoEditorShapless) {
            this.targetMonacoEditorShapless = MonacoEditor.setupEditor('target-shapeless-output-monaco-container', this._outputJsonShapeless);
          } else {
            this.targetMonacoEditorShapless.setValue(jsonData);
          }
        }
      }

      return TargetTreeView;
    }
)