define([
    'swagger-client',
    'text!./json/openapi_order.json',
    'text!./json/openapi_task.json'],
      (SwaggerClient, orderContent, taskContent, swagger_petstore) => {
          class SwaggerParser {

            constructor () { 
              this.orderSwagger = undefined;
              this.taskSwagger = undefined;
            }
            
            async loadMockSwaggers() {
              this.orderSwagger = await SwaggerClient.resolve({spec: JSON.parse(orderContent)});
              this.taskSwagger = await SwaggerClient.resolve({spec: JSON.parse(taskContent)});
            }
          }

          return SwaggerParser;
      }
);