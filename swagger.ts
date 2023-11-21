import swaggerAutogen from 'swagger-autogen';

const openAPI = swaggerAutogen({ openapi: '3.0.0' })


const doc = {
    info: {
        version: '',            // by default: '1.0.0'
        title: '',              // by default: 'REST API'
        description: ''         // by default: ''
    },
    servers: [
        {
            url: 'http://170.64.176.152:3003/api',              // by default: 'http://localhost:3000'
            description: ''       // by default: ''
        },
        // { ... }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            bearerAuth: [],
        },
    ],

};



const outputFile = './swagger-output.json';
const routes = ['./src/routes/routes.ts'];

openAPI(outputFile, routes, doc)

