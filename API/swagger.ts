import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
        version: '',            // by default: '1.0.0'
        title: '',              // by default: 'REST API'
        description: ''         // by default: ''
    },
    servers: [
        {
            url: 'localhost:3003',              // by default: 'http://localhost:3000'
            description: ''       // by default: ''
        },
        // { ... }
    ],
    tags: [                   // by default: empty Array
        {
            name: '',             // Tag name
            description: ''       // Tag description
        },
        // { ... }
    ],
    components: {}            // by default: empty object
};



const outputFile = './swagger-output.json';
const routes = ['./src/routes/routes.ts'];

swaggerAutogen()(outputFile, routes, doc)

