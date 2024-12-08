const path = require('path');
const { parseSchema } = require('./modules/parser/schemaParser');
const { generateCode } = require('./modules/generated/codeGenerator');
const { generateClientCode } = require('./modules/generated/clientGenerator'); // Import the client code generator function

const runCodeGeneration = async (schemaFilePath, outputDir, {
    generateClient = false
}) => {
    try {
        // Parse the schema file for models and enums
        const { models, enums } = parseSchema(schemaFilePath);

        // Generate code files in the specified output directory
        if (generateClient) {
            generateClientCode(models, enums, outputDir);
        }
        else {
            generateCode(models, enums, outputDir);
        }

        console.log(`Code generation completed successfully in ${outputDir}`);
    } catch (error) {
        console.error('Code generation failed:', error);
    }
};


module.exports = {
    runCodeGeneration
}