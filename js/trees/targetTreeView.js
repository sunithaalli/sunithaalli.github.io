define([
  'knockout',
  './baseTreeView',
  '../monaco/monacoEditor',
  'text!./view/targetTreeView.html'],
    (ko, BaseTreeView, MonacoEditor, targetTreeViewHtml) => {
      class TargetTreeView extends BaseTreeView {
        constructor (domContainer, schemaMode, targetSwagger, rootPath) {
          super(domContainer, targetTreeViewHtml, 'target-tree', schemaMode, 'application/targetschemanodes+json');
          this._outputJsonShapeless = ko.observable('{}');
          this.schemaTreeHeader = "Target";
          this.showTargetOutput = ko.observable(false);
          this._targetOutput = ko.observable('');

          if (!schemaMode()) {
            this.jsonTreeData = this.getTreeDataFromJsonBinding(this._outputJsonShapeless);
          } else {
            this.schemaTreeData = this.getTreeDataFromSwaggerEndpoint(targetSwagger, rootPath);
            this.showTargetOutput.subscribe((value) => {
              if (value) {
                window.setTimeout( () => {
                  this.targetOutputMonacoEditor = MonacoEditor.setupEditor('target-output-monaco-container', this._targetOutput);
                }, 100);
              }
            });

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

          this.initBinding(domContainer);
        }

        get targetOutputJsonBinding() {
          return this._targetOutput;
        }

        get outputJsonShapelessBinding() {
          return this._outputJsonShapeless;
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