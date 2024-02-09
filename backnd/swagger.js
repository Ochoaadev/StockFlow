
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'StockFlow',
      version: '1.0.0',
    },
    server:[
        {
            url: "http://localhost:5000"
        },
    ],
  },
  apis: ["src/docs/documentation.js"],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
    app.use(
      "/Documentation",
      SwaggerUi.serve,
      SwaggerUi.setup(swagerSpect)
    );
  
    console.log("[Swagger] " + "http://localhost:4000/Documentation");
  };
  
  module.exports = {swaggerDocs};