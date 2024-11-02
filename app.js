const path = require('path');
const { parseSchema } = require('./modules/parser/schemaParser');
const { generateCode } = require('./modules/generated/codeGenerator');

const runCodeGeneration = async (schemaFilePath, outputDir) => {
    try {
        // Parse the schema file for models and enums
        const { models, enums } = parseSchema(schemaFilePath);

        // Generate code files in the specified output directory
        generateCode(models, enums, outputDir);

        console.log(`Code generation completed successfully in ${outputDir}`);
    } catch (error) {
        console.error('Code generation failed:', error);
    }
};


module.exports = {
    runCodeGeneration
}