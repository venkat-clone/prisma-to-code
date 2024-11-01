const path = require('path');
const { parseSchema } = require('./modules/parser/schemaParser');
const { generateCode } = require('./modules/generated/codeGenerator');

const runCodeGeneration = (schemaFilePath, outputDir) => {
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

// Get the schema file path and output directory from command-line arguments or use defaults
const schemaFilePath = process.argv[2] || path.resolve(__dirname, 'schema.prisma');
const outputDir = process.argv[3] || path.resolve(__dirname, 'd:\\venkey\\test\\src');

// Run the code generation process
runCodeGeneration(schemaFilePath, outputDir);
