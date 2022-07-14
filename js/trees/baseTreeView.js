define([
  'knockout',
  'ojs/ojarraytreedataprovider',
  'ojs/ojknockout-keyset',
  'jsonpath'
  ],
    (ko, ArrayTreeDataProvider, koKeySet, jsonpath) => {
      let nextNumber = 0;

      const popuplateBasicDataTypeInfoFromValue = (dataType, value) => {
        // basic json data type
        if (typeof value == 'number') {
          dataType.icon = 'oj-ux-ico-hashtag';
          dataType.type = 'number';
          dataType.title += ' : ' + value;
        } else if (typeof value == 'string') {
          dataType.icon = 'oj-ux-ico-type-string';
          dataType.type = 'string';
          dataType.title += `: "${value}"`;
        } else if (typeof value == 'boolean') {
          dataType.icon = 'oj-ux-ico-boolean-alt';
          dataType.type = 'boolean';
          dataType.title += ' : ' + value;
        } else {
          dataType.icon = 'oj-ux-ico-astrix';
          dataType.type = 'object';
          dataType.title += ' : ' + value;
        }
      }

      const convertToArrayData = (obj, indexStr) => {
        const data = [];
        const keys = Object.keys(obj);
        keys.forEach((key, keyIndex) => {
          const id = indexStr ?  (indexStr+ '_'  + keyIndex) : keyIndex.toString();
          const dataObj = { 
            id,
            title: key
          };

          const value = obj[key];
          if (Array.isArray(value)) {
            dataObj.icon = 'oj-ux-ico-array';
            dataType.type = 'array';
            dataObj.children = [];
            value.forEach((arrayValue, arrayIndex) => {
              if (! (Array.isArray(arrayValue) || typeof arrayValue === 'object')) {
                const arrayDataObj = { 
                  id: id + "_" + arrayIndex,
                  title: ''
                };
                dataObj.children.push(arrayDataObj);
                popuplateBasicDataTypeInfoFromValue(arrayDataObj, arrayValue);
              } else {
                dataObj.children.push(...convertToArrayData(arrayValue, id + "_" + arrayIndex));
              }
              
            });
          } else if (typeof value === 'object') {
            dataObj.children = convertToArrayData(value, id);
            dataType.type = 'object';
            dataObj.icon = 'oj-ux-ico-brackets';
          } else {
            popuplateBasicDataTypeInfoFromValue(dataObj, value);
          }
          data.push(dataObj);
        })

        return data;
      }

      const getFirstSchemaNode = (node) => {
        const keys = Object.keys(node);
        for(let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key === 'schema') {
            return node[key];
          } else if(typeof node[key] === 'object'){
            const schema = getFirstSchemaNode(node[key]);
            if (schema) {
              return schema;
            }
          }
        };

        return undefined;
      }


      class BaseTreeView {
        static TYPE_TO_ICON = {
          'number':'oj-ux-ico-hashtag',
          'integer':'oj-ux-ico-hashtag',
          'string':'oj-ux-ico-type-string',
          'boolean':'oj-ux-ico-boolean-alt',
          'object':'oj-ux-ico-brackets',
          'array':'oj-ux-ico-array',
        };

        constructor (domContainer, viewHtml, selectedTabItem, schemaMode, dragDataType) { 
          // expanded set for json tree
          this.treeExpanded =  new koKeySet.ObservableKeySet().addAll();
          // expanded set for schema tree
          this.schemaTreeExpanded =  new koKeySet.ObservableKeySet().addAll();
          this.selectedTabItem = ko.observable(selectedTabItem);
          this.schemaMode = schemaMode;
          this.dragDataType = dragDataType; // defined by base classes
          this._dragContext = ko.observable('');
          this._dragContextTypes = ko.observable('');
          this.domContainer = domContainer;
          this.handleDragStart = this._handleDragStart.bind(this);

          domContainer.innerHTML = ''; // remove any existing content if needed
          ko.cleanNode(domContainer);
          domContainer.innerHTML = viewHtml;
        }
        
        initBinding(domContainer) {
          ko.applyBindings(this, domContainer.firstElementChild);
        }

        get dragContextBinding() {
          return this._dragContext;
        }

        get dragContextTypesBinding() {
          return this._dragContextTypes;
        }

        /**
         * Handler for drag start gesture
         * @param {Event} event 
         */
        _handleDragStart(event) {
          const dragData = event.dataTransfer.getData(this.dragDataType);
          if (dragData) {
            const dragObject = JSON.parse(dragData);

            // Establish the context of the drag
            const treeData = this.schemaTreeData.treeData;

            // NOTE data cannot have circular references through parentNode for DnD to work, hence we have to locate it 
            const findNodeById = (data, nodeId) => {
              for(let i = 0; i < data.length; i++) {
                if (data[i].id === nodeId) {
                  return data[i];
                }

                if (data[i].children) {
                  let parent = findNodeById(data[i].children, nodeId);
                  if (parent) {
                    return parent;
                  }
                }
              }
            }

            const parentContext = [];
            const parentContextTypes = [];
            parentContext.unshift(dragObject[0].title);
            parentContextTypes.unshift(dragObject[0].type);
            let parent = findNodeById(treeData, dragObject[0].parentId);
            while(parent) {
              parentContext.unshift(parent.title);
              parentContextTypes.unshift(parent.type);
              parent = findNodeById(treeData, parent.parentId);
            }
            // remove the root since it is not used in the expression
            parentContext.shift();
            parentContextTypes.shift();
            this._dragContext(jsonpath.stringify(parentContext));
            this._dragContextTypes(jsonpath.stringify(parentContextTypes));
          }
        }

        getTreeDataFromJsonBinding(jsonBinding) {
          return ko.pureComputed(() => {
            const parsedJson = JSON.parse(jsonBinding());
            const jsonData = convertToArrayData(parsedJson, '');
    
            return new ArrayTreeDataProvider(jsonData, {keyAttibutes: 'id'});
          });
        }

        /**
         * creates children for a schema node from the properties for the treeModel
         * @param {*} schemaData 
         * @param {} properties 
         */
        addPropertiesfromSchemaNodeToSchemaData(schemaData, properties) {
          const keys = Object.keys(properties);
          keys.forEach((key) => {
            const childNode = properties[key];
            const dataObj = { 
              id: 'key' + (++nextNumber), //TODO temp. 
              title: key,
              type: childNode.type
            };
            dataObj.icon = BaseTreeView.TYPE_TO_ICON[childNode.type];
            
            if(childNode.type == 'array') {
              // for arrays dig into the items property
              const items = childNode.items;
              if(items['$$ref']) {
                dataObj['$$ref'] = items['$$ref'];
              }
              dataObj.children = [];
              this.addPropertiesfromSchemaNodeToSchemaData(dataObj.children, items);
              dataObj.children.forEach(child => child.parentId = dataObj.id);
            } else if (childNode.type == 'object') {
              // add reference property, in case it it useful
              if (childNode['$$ref']) {
                dataObj['$$ref'] = childNode['$$ref'];
              }

              if (childNode.properties) {
                dataObj.children = [];
                this.addPropertiesfromSchemaNodeToSchemaData(dataObj.children, childNode.properties);
                dataObj.children.forEach(child => child.parentId = dataObj.id);
              }
            }
            schemaData.push(dataObj);
          });
        }

        /**
         * Converts Swagger data into tree data format
         * @param {*} swagger 
         * @param {*} rootPath 
         * @returns 
         */
        getTreeDataFromSwaggerEndpoint(swagger, rootPath) {
          // extract the title from the swagger file
          const schemaTreeTitle = swagger.spec?.info?.title;
          const schemaData = [];
          try {
            // TODO validate that the rootPath is correct and we get some elements
            const schemaNode = jsonpath.query(swagger.spec, rootPath, 1)[0];
            const rootKeys = jsonpath.parse(rootPath);

            // remember the schema Node
            this.schemaNode = schemaNode;
            
            // Use the last part of jsonpath stripping out the root and the verb as root label
            let rootLabel = schemaTreeTitle;

            if (!rootLabel){
              rootLabel = jsonpath.stringify(rootKeys.slice(rootKeys.length - 1)).substring(2);
              if (rootLabel.startsWith('.')){
                rootLabel = rootLabel.substring(1);
              }
            }

            const dataObj = { 
              id: rootLabel,
              title: rootLabel
            };

            dataObj.icon = 'oj-ux-ico-brackets';
            let schemaItems = schemaNode.properties;

            // in case schema node has items
            if(schemaNode.items) {
              schemaItems = schemaNode.items;
            }

            if (schemaItems['$$ref']) {
              dataObj['$$ref'] = schemaItems['$$ref'];
            }
            schemaData.push(dataObj);
            dataObj.children = [];
            this.addPropertiesfromSchemaNodeToSchemaData(dataObj.children, schemaItems);
            dataObj.children.forEach(child => child.parentId = dataObj.id);
          } catch(e) {
            console.error(`error parsing swagger: ${swagger}, rootPath: ${rootPath}.\n ${e}`)
          }
          return new ArrayTreeDataProvider(schemaData, {keyAttibutes: 'id'});
        }
      }

      return BaseTreeView;
    }
);