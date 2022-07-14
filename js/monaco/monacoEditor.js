define([''],
    () => {
      class monacoEditor {
        static setupEditor(containerId, valueBinding){
          const monacoEditor = monaco.editor.create(document.getElementById(containerId), {
            value: valueBinding(),
            language: 'json',
            minimap: {
              enabled: false
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          });
    
          let updateTimeout;
          monacoEditor.getModel().onDidChangeContent(() => {
            // debounce the updates
            const updateFn = () => { 
              valueBinding(monacoEditor.getValue());
              updateTimeout = undefined;
            };
    
            if (updateTimeout) {
              window.clearTimeout(updateTimeout);
            }
            updateTimeout = window.setTimeout(updateFn, 300);
          });
          return monacoEditor;
        }
      }
      return monacoEditor;
    }
)