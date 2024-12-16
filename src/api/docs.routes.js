import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

const swaggerRoute = Router();

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  apis: ["./src/api/*"],
  definition: {
    swagger: "2.0",
    info: {
      title: "Note Taking",
      version: "1.0.0",
      description: ``,
      // contact: {
      //   email: 'mr.',
      //   name: 'Malik Samad',
      // },
    },
    definitions: {},
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "authorization",
        in: "header",
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger Page
swaggerRoute.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default swaggerRoute;
