const path = require('path');
const { parseSchema } = require('./modules/parser/schemaParser');
const { generateCode,genarateLayered } = require('./modules/generated/codeGenerator');
const { generateClientCode } = require('./modules/generated/clientGenerator'); // Import the client code generator function
const {generateDaoServicesCode} = require('./modules/generated/DaoServiceGenerator');

const runCodeGeneration = async({
    generateClient,
    microservices,
    api,
    schemaPath,
    outputDir
}) => {
    try {
        // Parse the schema file for models and enums
        const { models, enums } = parseSchema(schemaPath);

        // Generate code files in the specified output directory
        if (generateClient) {
            genarateLayered(models, enums, outputDir);
            // generateClientCode(models, enums, outputDir);
        }
        if(microservices) {

            // one more if statement to check dao services
            generateDaoServicesCode(models, enums, outputDir);
        }
        if (api) {
            genarateLayered(models, enums, outputDir);
            // generateCode(models, enums, outputDir, { api });
        }

        console.log(`Code generation completed successfully in ${outputDir}`);
    } catch (error) {
        console.error('Code generation failed:', error);
    }
};


module.exports = {
    runCodeGeneration
}