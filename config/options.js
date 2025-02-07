const cliOptions = {
    'generate-client': {
        flag: '--generate-client',
        description: 'Include generating client code along with other outputs',
        prompt: 'Do you want to generate client code? (yes/no): ',
        default: false
    },
    'microservices': {
        flag: '--microservices',
        description: 'Generate code with microservices architecture',
        prompt: 'Do you want to generate code for microservices architecture? (yes/no): ',
        default: false
    },
    'api': {
        flag: '--api',
        description: 'Generate REST API endpoints with Swagger documentation',
        prompt: 'Do you want to generate REST API endpoints? (yes/no): ',
        default: true,
        subOptions: {
            swagger: true,
            validation: true,
            errorHandling: true
        }
    }
};

const defaultPaths = {
    schema: 'prisma/schema.prisma',
    output: 'src'
};

module.exports = { cliOptions, defaultPaths };
