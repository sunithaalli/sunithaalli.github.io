define([
  'knockout',
  'ojs/ojarraytreedataprovider',
  'ojs/ojkeyset',
  'text!./view/expressionsView.html',
  'jsonpath',
  'ojs/ojselectcombobox',
  'ojs/ojdialog',
  'ojs/ojknockout', 
  'ojs/ojtreeview'],
    (ko, ArrayTreeDataProvider, ojkeyset, ExpressionsViewHtml, jsonpath) => {
      
      const mockExpressions = [
        {
          id: 'e1',
          name: 'foo',
          expression: '.x.y',
        },
        {
          id: 'e2',
          name: 'soo',
          expression: '"new value"',
        },
        {
          id: 'e3',
          name: 'bar',
          expression: '.z',
          context: ' | map',
          children: [{
            id: 'e3:1',
            name: 'newcomment',
            expression: '.comments',
          },
          {
            id: 'e3_2',
            name: 'newTitle',
            expression: '.title',
          }]
        },
      ];

      const mockSchemaExpressions = [
        {
          id: 'e1',
          name: 'id',
          expression: '.["request-wrapper"].orderId',
        },
        {
          id: 'e2',
          name: 'title',
          expression: '.["request-wrapper"].orderName',
        },
        {
          id: 'e3',
          name: 'status',
          expression: '.["request-wrapper"].orderStatus',
        },
        {
          id: 'e4',
          name: 'invoices',
          expression: '.["request-wrapper"].billOfLines',
          context: ' | map',
          children: [{
            id: 'e4_1',
            name: 'invoiceId',
            expression: '.billLineId',
          },
          {
            id: 'e4_2',
            name: 'usageQuantity',
            expression: '.totalUsage',
          },
          {
            id: 'e4_3',
            name: 'invoiceDescription',
            expression: '("Bill Id Number: " + .billLineId)',
          }]
        }
      ];

      class ExpressionsView {
        /**
         * Creates the expression View UI model
         * @param {DOMElement} domContainer 
         * @param {boolean} schemaMode 
         * @param {boolean} sourceMappingMode 
         * @param {ko.Binding} targetDragContext drag context value of the target node that is updated during drag and drop
         * @param {ko.Binding} sourceDragContext drag context value of the source node that is updated during drag and drop
         * @param {ko.Binding} targetDragContextTypes data types for the drag context of the target node that is updated during drag and drop
         * @param {ko.Binding} sourceDragContextTypes data types for the drag context of the source node that is updated during drag and drop
         * @param {Array<*>} schemaExpressions data for expressions
         */
        constructor (domContainer, schemaMode, sourceMappingMode, targetDragContext, sourceDragContext, targetDragContextTypes, sourceDragContextTypes, expressions = schemaMode() ? mockSchemaExpressions : mockExpressions) {
          this.selectedTabItem = ko.observable('expression-list');
          this.expressionColumns=[
            {'headerText': 'Target Node', 'minWidth': '10.5rem', 'headerClassName': 'oj-sm-padding-6x-start', 'sortable': 'disabled'},
            {'headerText': 'Expression', 'weight': "2", 'minWidth': '19rem', 'headerClassName': 'oj-sm-padding-6x-start', 'sortable': 'disabled'},
            {'headerText': 'Actions', 'minWidth': '7.8rem','sortable': 'disabled'}
          ];
    
          this.expressionsObservable = this.createNestedObservableArray(expressions);
          
          this.rootNode = ko.observable('response-wrapper');
          this.sourceMappingMode = sourceMappingMode;

          this.dropItemsTypes = sourceMappingMode() ? ['application/sourceschemanodes+json'] 
                                  : ['application/targetschemanodes+json'];
          
          this.sourceMappingMode.subscribe((mode) => {
            this.dropItemsTypes = mode ? ['application/sourceschemanodes+json'] 
                                  : ['application/targetschemanodes+json'];
            const treeView = document.getElementById('expression-tree-view');
            treeView.dnd.drop.items.dataTypes = this.dropItemsTypes;
          });

          this.nextId = 1;

          this.expressionsDataProvider = new ArrayTreeDataProvider(this.expressionsObservable, {keyAttibutes: 'id'});
          this.expanded = ko.observable(new ojkeyset.AllKeySetImpl());

          this._generatedJQExpression = '';
          this._payloadForValidation = '';
          this.handleDrop = this._handleDrop.bind(this);
          this.handleDragOver = this._handleDragOver.bind(this);
          this.validationMessageTitle = ko.observable('');
          this.validationMessageDetail = ko.observable('');
          this.dropPopupWarningText = ko.observable('');
          this.newExpressionItemName = ko.observable('');
          this.newExpressionItemType = ko.observable('default');
          this.editRowItemName = ko.observable('');
          this._expressionValue = ko.observable('');
          this.expressionValidationVisible = ko.observable(false);

          // row being currently edited
          this._currentEditRow = undefined;
          this.expressionItemAction = this._expressionItemAction.bind(this);
          this.expressionNameClick = this._expressionNameClick.bind(this);
          this.handlePopupKeyUp = this._handlePopupKeyUp.bind(this);
          this.expressionDetailVisible = ko.observable(false);

          ko.cleanNode(domContainer);
          domContainer.innerHTML = ExpressionsViewHtml;
          ko.applyBindings(this, domContainer.firstElementChild);

          this.domContainer = domContainer;
          this.schemaMode = schemaMode;
          this.targetDragContext = targetDragContext;
          this.sourceDragContext = sourceDragContext;
          this.targetDragContextTypes = targetDragContextTypes;
          this.sourceDragContextTypes = sourceDragContextTypes;
        }

        get expressionValueBinding() {
          return this._expressionValue;
        }

        /**
         * Wraps the expression array data with KO Observable Array so that the data can be mutated
         * @param {*} expressions 
         * @returns 
         */
        createNestedObservableArray(expressions, parentExpression) {
            return ko.observableArray(expressions.map((expression) => {
                const newExpression  = {...expression};

                if (expression.children) {
                  newExpression.children = this.createNestedObservableArray(newExpression.children, newExpression);
                }

                // assign the parent Expression to child expressions so that it is easy to walk the heirarchy
                newExpression.parent = parentExpression;
                newExpression.name = ko.observable(newExpression.name);
                newExpression.expression = ko.observable(newExpression.expression);

                return newExpression;
            }));
        }

        /**
         * Getter for _generatedJQExpression instance variable 
         */
        get generatedJQExpression() {
          return this._generatedJQExpression;
        }
        set generatedJQExpression(value) {
          this._generatedJQExpression = value;
        }

        /**
         * Getter and Setter for _payloadForValidation instance variable 
         */
        get payloadForValidation() {
          return this._payloadForValidation;
        }

        set payloadForValidation(value) {
          this._payloadForValidation = value;
        }

        /**
         * 
         * @param {*} event 
         * @param {*} context 
         */
        _expressionItemAction(event, context){
          if (event.target.id === 'editExpression') {
            this._editExpressionItem(context);
            this.editExpressionItemSavedRow = context.data
          } else if (event.target.id === 'addExpression') {
            document.getElementById('addExpressionItemPopup').open();
            // save the row at which add was clicked
            this.addExpressionItemSavedRow = context.data;
          } else if (event.target.id === 'addExpressionOK'){
            this._addExpressionItem(this.addExpressionItemSavedRow);
            this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));
            document.getElementById('addExpressionItemPopup').close();
          } else if (event.target.id === 'deleteExpression') {
            this._deleteExpressionItem(context);
            this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));
          } else if (event.target.id === 'expressionDetailPopupClose') {
            this.expressionDetailVisible(false);
            document.getElementById('expressionDetailPopup').close();
          } else if (event.target.id === 'expressionDetailPopupOK') {
            this._expressionDetailPopupOK(this.editExpressionItemSavedRow);
          } else if (event.target.id === 'editExpressionItemNameOK') {
            this.editNameRow.name(this.editRowItemName());
            document.getElementById('editExpressionItemNamePopup').close();
            this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));
          }
        }

        /**
         * 
         * @param {*} event 
         * @param {*} context 
         */
        _expressionNameClick(event, context) {
          // only allow for source mapping mode
          if (this.sourceMappingMode()) {
            const row = context.data;
            if (this.editNameRow) {
              document.getElementById('editExpressionItemNamePopup').close();
            }
            this.editNameRow = row;
            this.editRowItemName (row.name());
            document.getElementById('editExpressionItemNamePopup').open(event.target);
          }
        }
        
        /**
         * 
         * @param {*} event 
         */
        _handlePopupKeyUp(event) {
          if (event.key === 'Enter') {
            if (event.currentTarget.id === 'addExpressionItemPopup') {
              this._addExpressionItem(this.addExpressionItemSavedRow);
              document.getElementById('addExpressionItemPopup').close();
            } else if (event.currentTarget.id === 'editExpressionItemNamePopup') {
              this.editNameRow.name(this.editRowItemName());
              document.getElementById('editExpressionItemNamePopup').close();
            }
            this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));
          }
        }

        /**
         * Adds an expression item under the current item
         * @param {*} data 
         */
        _addExpressionItem(row){
          const nodeName = this.newExpressionItemName();
          // TODO validate that the nodeName is unique in the parent item
          if (row && nodeName) {
            const parent = row.parent; 
            const children = parent?.children || this.expressionsObservable;
            const type = this.newExpressionItemType() !== 'default' ? this.newExpressionItemType() : undefined;
            const newNode = {
              name: ko.observable(nodeName),
              id: `newnode${this.nextId++}`,
              type, 
              context: type === 'array' ? ' | map': undefined,
              expression:  ko.observable(type === 'array'? '[]': ''),
            }

            for (let i = 0; i < children().length; i++) {
              const child = children()[i];
              if (child.id === row.id) {
                // for now insert after the node. 
                children.splice(i + 1, 0, newNode);
                break;
              }
            }
          }
        }

        /**
         * Adds an expression item under the current item
         * @param {*} context 
         */
         _deleteExpressionItem(context){
          const row = context.data;
          if (row) {
            const parent = row.parent; 
            const children = parent?.children || this.expressionsObservable;

            for (let i = 0; i < children().length; i++) {
              const child = children()[i];
              if (child.id === row.id) {
                // remove item
                children.splice(i, 1);
                break;
              }
            }
          }
        }

        /**
         * 
         * @param {*} context 
         */
        _editExpressionItem(context){
          // just toggle already open one
          const expressionDetailPopup = document.getElementById('expressionDetailPopup');

          if (expressionDetailPopup.isOpen()) {
            this.expressionDetailVisible(false);
            expressionDetailPopup.close();
          } else {
            this.expressionValidationVisible(false);
            this._currentEditRow = context.data;
            expressionDetailPopup.open(`#rowExpressionText${context.data.id}`);
            this.expressionDetailVisible(true);
            // set dragover and drop listeners
            const container = document.getElementById('jq-expression-monaco-container');
            container.addEventListener('dragover', event => {
              this._expressionDetailDragOver(event);
            });
            container.addEventListener('drop', event => {
              this._expressionDetailDrop(event);
            });
            // Use monaco editor on the expression item
            window.setTimeout(() => this._createMonacoEditorForItem(context), 300);
          }
        }
  
        /**
         * Creates the monaco editor for the currently edited item
         * @param {*} context 
         */
        _createMonacoEditorForItem(context) {
          const monacoEditor = monaco.editor.create(document.getElementById('jq-expression-monaco-container'), {
            value: context.data.expression(),
            language: 'jq',
            minimap: {
              enabled: false
            },
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            glyphMargin: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          });

          this.expressionMonacoEditor = monacoEditor;
        }

        /**
         * internal function to update the expression value for a row
         * @param {*} row 
         * @param {string} expressionValue 
         * @param {boolean} validate if the updated value need to be validated
         */
        async _updateExpressionInRow(row, expressionValue, validate) {
          const containerElement = document.getElementById('jq-expression-monaco-container');
          const oldExpressionValue = row.expression();
          let complexExprMissingBrackets = false;

          try {
            row.expression(expressionValue);

            if (validate) {
              // check if the expression has a space character in it
              if (expressionValue.split(' ').length > 1 && (expressionValue.charAt(0) !== '(' || 
                  expressionValue.charAt(expressionValue.length -1) !== ')')) {
                    complexExprMissingBrackets = true;
                    throw new Error('Please surround complex expressions with brackets ()');
              }
              await this._validateExpressionItem(row, expressionValue);
            }
            
            // validation successful update the tree row by replacing the row
            if (validate) {
              // validation successful so close the editor popup
              this.expressionDetailVisible(false);
              document.getElementById('expressionDetailPopup').close();
            }

            this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));
          } catch (e) {
            // validation failure, set the old value back to the row
            row.expression(oldExpressionValue);

            // Show error on expression element
            containerElement.classList.add('oj-badge-danger');
            this.validationMessageDetail('' + (complexExprMissingBrackets ? '' : e.stack));
            this.validationMessageTitle(e.message);
            this.expressionValidationVisible(true);
          }
        }
        /**
         * OK Click on the edit expression
         * @param {*} row 
         */
        async _expressionDetailPopupOK(row) {
          if (this._payloadForValidation) {
            await this._updateExpressionInRow(row, this.expressionMonacoEditor.getValue(), true);
          } else {
            this.domContainer.dispatchEvent(new Event('generateSourcePayload'));
            await this._updateExpressionInRow(row, this.expressionMonacoEditor.getValue(), true);
          }
        }

        /**
         * Internal function to validate the value of an expression in a row by considering the entire parent heirarchy
         * @param {*} row 
         */
        async _validateExpressionItem(row) {
          const itemsInPath = [row];
          let parentRow = row.parent;
          while (parentRow) {
            itemsInPath.unshift(parentRow);
            parentRow = parentRow.parent;
          }

          const payloadObject = JSON.parse(this._payloadForValidation);
          let filterStr = `{ "${this.rootNode()}": {`;
          let closeParentGroup = false;
          for (let i = 0; i < itemsInPath.length; i++) {
            const item = itemsInPath[i];
            filterStr = `${filterStr}"${item.name}": ${item.expression() || (item.children ? '' : null)}`;

            // close the group from the parent expression
            if ( closeParentGroup ) {
              filterStr = `${filterStr} })`;
              closeParentGroup = false;
            }

            if (i < itemsInPath.length -1 ) {
             
              filterStr = `${filterStr}  ${item.context? item.context : '' }({`;
              closeParentGroup = true;
            } 
            
          }

          filterStr = `${filterStr} }}`;

          const result = await jq.promised.json(payloadObject, filterStr);

          return result;
        }

        /**
         * Given the data array and the id we are searching for retrieves the row data assocaited with it
         * @param {*} data 
         * @param {*} id 
         * @returns 
         */
        _findRowById(data, id) {
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].id == id) {
                return data[i];
            }
            else if (data[i].children) {
                const row = this._findRowById(data[i].children(), id);
                if (row) {
                    return row;
                }
            }
          }
        }

        /**
         * Retrieves the row data from the event target 
         * @param {DOMEvent} event 
         */
        _findRowFromEventTarget(event) {
          let rowElement = event.target;
          let rowId = rowElement.getAttribute('data-row-id');
          while (!rowId && rowElement) {
            rowElement = rowElement.parentElement;
            rowId = rowElement?.getAttribute('data-row-id');
          }

          if (rowId) {
            const treeData = this.expressionsObservable();
            return this._findRowById(treeData, rowId);
          }
        }

        /**
         * 
         * @param {*} row 
         */
        _findDropContext(row) {
          const parentContext = [];
          let parent = row.parent;
          while(parent) {
            parentContext.unshift(parent.name());
            parent = parent.parent;
          }
          parentContext.unshift(this.rootNode());
          const dropContext = jsonpath.stringify(parentContext);
          return dropContext;
        }

        /**
         * Validates that the drop location does not have duplicate node
         * @param {*} row 
         * @returns 
         */
        _isDuplicateChildForDrop(row, dragItemTitle) {
          const parent = row.parent;
          const children = parent?.children() || this.expressionsObservable();
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.name() === dragItemTitle) {
              return true;
            }
          }
          return false;
        }

        /**
         * Validates the drop target
         * @param {*} event 
         * @param {*} context 
         * @param {*} row row data at the drop target
         * @returns {object} object params associated with the drop target check
         */
        _isValidDropTarget(event, context, row) {
          const returnParams = {};
          if (!row) {
            returnParams.isValid = false;
            return returnParams;
          }
          const dropContext = this._findDropContext(row);
          const targetDragContext = this.targetDragContext();
          const index = targetDragContext.indexOf(dropContext);

          if (targetDragContext !== this.rootNode && index !== -1){
            // allow immediate chidren to be dropped inside a complex parent
            if (context.position === 'inside' && (row.type === 'object' || row.type === 'array')) {
              const dragHeirarchy = jsonpath.parse(targetDragContext);
              if (dragHeirarchy.length > 1 && dragHeirarchy[dragHeirarchy.length - 2].expression.value === row.name) {
                returnParams.isDropInside = true;
              }
            }

            // Find the relative node with respect to the current drop target
            // For e.g. if A > B > C > D is dropped onto A > B we need to make sure that under B there is no C
            const relativeNodeHeirarchy = jsonpath.parse(targetDragContext.substring(index + dropContext.length + 1));
            const relativeDragRoot = relativeNodeHeirarchy[0].expression.value;

            if (returnParams.isDropInside || !this._isDuplicateChildForDrop(row, relativeDragRoot)) {
              const dropHeirarchy = jsonpath.parse(dropContext);
              const targetDragContextTypes = jsonpath.parse(this.targetDragContextTypes());

              returnParams.relativeNodeTypes = targetDragContextTypes.slice(dropHeirarchy.length);
              returnParams.relativeNodeHeirarchy = relativeNodeHeirarchy;
              returnParams.isValid = true;
              return returnParams;
            }
            returnParams.isDuplicate = true;
          } else {
            returnParams.isValid = false;
          }

          return returnParams;
        }

        /**
         * Validates that the source node being dropped is unique under a parent node
         * @param {*} row 
         */
        _isValidSourceNode(row) {
          const dragContext = this.sourceDragContext();
          if (dragContext) {
            const dragHeirarchy = jsonpath.parse(dragContext);
            if (dragHeirarchy.length > 0) {
              const nodeName = dragHeirarchy[dragHeirarchy.length - 1].expression.value;
              if (this._isDuplicateChildForDrop(row, nodeName)){
                return false;
              }
            }
          }

          return true;
        }
        /**
         * Handler for drag enter event
         * @param {*} event 
         */
        _handleDragOver(event, context) {
          const dataType = this.sourceMappingMode() ? 'application/sourceschemanodes+json': 'application/targetschemanodes+json';
          if (event.dataTransfer.types.indexOf(dataType) !== -1) {
            const row = (context?.item && context.item['oj-item-data']) || this._findRowFromEventTarget(event);

            // source mapping mode only validate the node anme
            if (this.sourceMappingMode()) {
              if(!this._isValidSourceNode(row)) {
                event.dataTransfer.dropEffect = 'none';
              }
              return;
            }
            
            const returnParams = this._isValidDropTarget(event, context, row);
            
            if (!returnParams.isValid) {
              event.dataTransfer.dropEffect = 'none';
            }
          }
        }

        /**
         * Validates the drop the drop target
         * @param {*} params 
         * @returns true if valid otherwise false
         */
        _validateDropTarget(params) {
          if (params.isDuplicate) {
            // TODO translate
            this.dropPopupWarningText('Duplicate Expression Node');
            document.getElementById('targetDropPopup').open();
            return false;
          } else if (!params.isValid) {
            // TODO translate
            this.dropPopupWarningText('Invalid Drop Location');
            document.getElementById('targetDropPopup').open(event.target);
            return false;
          }

          return true;
        }

        /**
         * Handles inserting nodes inside an existing parent node
         * @param {*} row 
         * @param {*} relativeNodeHeirarchy 
         * @param {*} relativeNodeTypes 
         * @returns 
         */
        _handleDropInside(row, relativeNodeHeirarchy, relativeNodeTypes) {
          const updatedRow =  {...row};
          let nodeName = relativeNodeHeirarchy[relativeNodeHeirarchy.length - 1].expression.value;
          let type = relativeNodeTypes[relativeNodeTypes.length - 1].expression.value;
          const newNode = {
            id: `newnode${this.nextId++}`,
            name: ko.observable(nodeName),
            type,
            parent: updatedRow,
            expression: ko.observable(type === 'array'? '[]': ''),
            context: type === 'array' ? ' | map': undefined,
          }

          updatedRow.children = ko.observableArray(!updatedRow.children ? [] : updatedRow.children());

          updatedRow.children.push(newNode);

          // replace the row in the parent
          const parent = row.parent;
          const children = parent?.children || this.expressionsObservable;
          children.splice(children().indexOf(row), 1, updatedRow);
        }

        /**
         * When the drag and drop from the source is enabled and the drag node has children create the whole hierarchy
         * @param {*} node 
         * @param {Array} children 
         */
        _createChildrenFromDragSource(node, children) {
          const childExpressions = [];
          children.forEach((child) => {
            const newNode = {
              id: `newnode${this.nextId++}`,
              name: ko.observable(child.title),
              type: child.type,
              parent: node,
              expression: ko.observable(child.type === 'array'? '[]': ''),
              context: child.type === 'array' ? ' | map': undefined,
            }
            if (child.children) {
              this._createChildrenFromDragSource(newNode, child.children);
            }
            childExpressions.push(newNode);
          });

          node.children = ko.observableArray(childExpressions)
        }
        
        /**
         * Handle drag and drop from the source
         * @param {*} context 
         * @param {*} row 
         * @param {Array} dragNodeChildren children of the drag data if any
         * @returns 
         */
        _handleDropFromSource(context, row, dragNodeChildren) {
          if (!this._isValidSourceNode(row) || !this.sourceDragContext())
          {
            return;
          }
          const dragHeirarchy = jsonpath.parse(this.sourceDragContext());
          const nodeName = dragHeirarchy[dragHeirarchy.length - 1].expression.value;
          const dragContextTypes = jsonpath.parse(this.sourceDragContextTypes());
          const type = dragContextTypes[dragContextTypes.length - 1].expression.value;

          const newNode = {
            id: `newnode${this.nextId++}`,
            name: ko.observable(nodeName),
            type,
            parent: row.parent,
            expression: ko.observable(type === 'array'? '[]': ''),
            context: type === 'array' ? ' | map': undefined,
          }

          if (dragNodeChildren) {
            this._createChildrenFromDragSource(newNode, dragNodeChildren);
          }

          const parent = row.parent;
          const children = parent?.children || this.expressionsObservable;
          if (context.position === 'inside' && (row.type === 'array' || row.type ==='object')) {
            const updatedRow =  {...row};
            updatedRow.children = ko.observableArray(!updatedRow.children ? [] : updatedRow.children());

            updatedRow.children.push(newNode);

            // replace the row in the parent
            const parent = row.parent;
            const children = parent?.children || this.expressionsObservable;
            children.splice(children().indexOf(row), 1, updatedRow);
          } else {
            const index = children().indexOf(row);
            children.splice(context.position === 'before' ? index : index + 1, 0, newNode);  
          }
          this.domContainer.dispatchEvent(new Event('generateTargetJsonOutput', {}));          
        }

        /**
         * Handler for drag and drop  event
         * @param {*} event 
         */
        _handleDrop(event, context) {
          const dataType = this.sourceMappingMode() ? 'application/sourceschemanodes+json': 'application/targetschemanodes+json';
          const dragData = event.dataTransfer.getData(dataType);
          if (dragData) {
            const row = (context?.item && context.item['oj-item-data']) || this._findRowFromEventTarget(event);

            if (this.sourceMappingMode()) {
              const dragDataObj = JSON.parse(dragData);
              return this._handleDropFromSource(context, row, dragDataObj[0]?.children);
            }

            const params = this._isValidDropTarget(event, context, row);

            if (!this._validateDropTarget(params))
            {
              return;
            }

            // heirachy of nodes that are being dropped 
            const relativeNodeHeirarchy = params.relativeNodeHeirarchy;
            // data types of nodes that are being dropped
            const relativeNodeTypes = params.relativeNodeTypes;

            // simply append the child element 
            if (params.isDropInside) {
              this._handleDropInside(row, relativeNodeHeirarchy, relativeNodeTypes);
              return;
            }

            // declare function used for recursive insertion
            const buildChildren = (relativeNodeHeirarchy, parent, row) => {
              let nodeName = relativeNodeHeirarchy.splice(0, 1)[0].expression.value;
              let type = relativeNodeTypes.splice(0, 1)[0].expression.value;
              const newNode = {
                id: `newnode${this.nextId++}`,
                name: ko.observable(nodeName),
                type,
                expression: ko.observable(type === 'array'? '[]': ''),
                context: type === 'array' ? ' | map': undefined,
              }

              if (relativeNodeHeirarchy.length > 0) {
                newNode.children = ko.observableArray([]);
                // after the first level of insertion we are simply creating a single child node, So pass in null for the row
                buildChildren(relativeNodeHeirarchy, newNode, null);
              }

              const children = parent?.children || this.expressionsObservable;
              // at the first level of insertion use the row after which we are inserting
              if ( row ) {
                for (let c = 0; c < children().length; c++) {
                  const child = children()[c];
                  if (child.id === row.id) {
                    // for now insert after the node. We have use the flattened index and context.index 
                    // to determine before or after the node
                    children.splice(context.position === 'before' ? c : c + 1, 0, newNode);
                    break;
                  }
                }
              } else {
                // we are creating new children
                children.push(newNode);
              }

              newNode.parent = parent;
            }
            buildChildren(relativeNodeHeirarchy, row.parent, row);
          }
        }

        /**
         * DragOver expression detail
         * @param {*} event 
         */
        _expressionDetailDragOver(event) {
          if(event.dataTransfer.types.includes('application/sourceschemanodes+json')) {

            // only allow source arrays to be dropped on the array targets
            if (this._currentEditRow.type === 'array') {
              const dragContextTypes = jsonpath.parse(this.sourceDragContextTypes());

              if (dragContextTypes[dragContextTypes.length - 1].expression.value !== 'array') {
                return;
              }
            }

            event.dataTransfer.dropEffect = "copy";
            //TODO move the cursor position based on the mouse
            event.preventDefault();
          }
        }

        /**
         * Drop in the monaco expression detail
         * @param {*} event 
         */
        async _expressionDetailDrop(event) {
          if(event.dataTransfer.types.includes('application/sourceschemanodes+json')) {

            let sourceJsonPath = this.sourceDragContext();
            if (sourceJsonPath.startsWith('$')) {
              sourceJsonPath = `.${sourceJsonPath.substring(1)}`;
            }
            
            // check for the forEach use case by walking up the parent expression
            let parent = this._currentEditRow.parent;
            let parentDepth = 1;
            while (parent) {
              if (parent.type === 'array') {
                // check if we dropping inside a array parent, then auto create the parent mapping as well
                if (parent.expression() === '[]') {
                  const dragContextTypes = jsonpath.parse(this.sourceDragContextTypes());
                  if (dragContextTypes.length - (parentDepth+1) >= 0 && dragContextTypes[dragContextTypes.length - (parentDepth + 1)].expression.value === 'array') {
                    let sourcePathWithRoot = sourceJsonPath;
                    if (sourcePathWithRoot.startsWith('.')) {
                      sourcePathWithRoot = `$${sourceJsonPath.substring(1)}`;
                    }
                    const parseSourceJsons = jsonpath.parse(sourcePathWithRoot);
                    let parentPath = jsonpath.stringify(parseSourceJsons.slice(0, dragContextTypes.length - parentDepth));
                    sourceJsonPath = jsonpath.stringify(parseSourceJsons.slice(dragContextTypes.length - parentDepth));

                    // convert it back to '.' relative path used by JQ expressions
                    if (parentPath.startsWith('$')) {
                      parentPath = `.${parentPath.substring(1)}`;
                    }
                    // the remaining path has an extra root with relative path. So strip off the root
                    if (sourceJsonPath.startsWith('$')) {
                      sourceJsonPath = sourceJsonPath.substring(1);
                    }

                    await this._updateExpressionInRow(parent, parentPath, false)
                    break;
                  }
                }

                // if the parent is an array and it expression matches array expression being dragged compute relative path
                if(sourceJsonPath.startsWith(parent.expression())) {
                  sourceJsonPath = sourceJsonPath.substring(parent.expression().length);
                  break;
                }
              }
              parent = parent.parent;
              parentDepth++;
            } 
            

            /* const position = this.expressionMonacoEditor.getPosition(event.clientX, event.clientY);
            const range = new monaco.Range(position.lineNumber, position.column);
            const selection = new monaco.Selection(position.lineNumber, position.column, position.lineNumber, position.column);
            this.expressionMonacoEditor.executeEdits('insert', [{range, text: sourceJsonPath, forceMoveMarkers: true}], [selection]);
            */
            this.expressionMonacoEditor.focus();
            const value = this.expressionMonacoEditor.getValue();
            if (!value || value.trim() === '[]') {
              this.expressionMonacoEditor.setValue(sourceJsonPath);
            } else {
              this.expressionMonacoEditor.trigger('keyboard', 'type', {text: sourceJsonPath});
            }
            event.preventDefault();
          }
        }

        /**
         * Recursive function to generate expression from a list of expressions
         */
        generateStringFromExpressions(expressions) {
          let filterStr = ''
          expressions.forEach((item, index) => {
            filterStr = `${filterStr}${index > 0 ? ', ' : ''}"${item.name()}": ${item.expression() || (item.children ? '' : null)}`;
            if (item.children) {
              filterStr = `${filterStr} ${item.context? item.context + '(' : ''} {`;
              filterStr = `${filterStr} ${this.generateStringFromExpressions(item.children())}`;
              filterStr = `${filterStr} } ${item.context? ')' : ''}`;
            }
          });

          return filterStr;
        }

        /**
         * 
         * @returns Builds the JQ Expression used for test/runtime functionality
         */
        buildJQExpressionFilter() {
          let filterStr = `{ "${this.rootNode()}": {`;
          filterStr = `${filterStr} ${this.generateStringFromExpressions(this.expressionsObservable())}`;
          filterStr = `${filterStr} }}`;

          this.generatedJQExpression = filterStr;
          return filterStr
        }

        async runJQFilterOnSourcePayload(payload) {
          try{
            let jsonFromPayload = (typeof payload === 'string') ? JSON.parse(payload) : payload;
            const result = await jq.promised.json(jsonFromPayload, this.buildJQExpressionFilter());

            return JSON.stringify(result, null, 2);
          } catch (e) {
            let errMessage = e.message;
              errMessage += '\n\n' + e.stack;
            return errMessage;
          };
        }

        toggleFunctions(e){
          const container = document.querySelector('#function-container');
          const currentDisplay = container.style.display;
          container.style.display = currentDisplay === 'none' ? '' : 'none';
          this.toggleFunctionsIcon(currentDisplay === 'none' ? 'oj-ux-ico-panel-expand-left' : 'oj-ux-ico-panel-expand-right');
  
          // TODO fix this
          const monacoContainer = document.getElementById('jq-expression-monaco-container');
          if (currentDisplay === 'none') {
            monacoContainer.parentElement.style.width = 'calc(100% - 200px)'; 
          } else {
            monacoContainer.parentElement.style.width = '100%'; 
          }
        }
      }

      return ExpressionsView;
    }
)