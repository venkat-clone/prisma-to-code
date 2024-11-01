const { parseSchema } = require('./modules/parser/schemaParser');
const { generateCode } = require('./modules/generated/codeGenerator');

const runCodeGeneration = (schemaFilePath) => {
    const { models, enums } = parseSchema(schemaFilePath);
    generateCode(models, enums, 'd:\\venkey\\automate-backend\\generated');
    console.log('Code generation completed successfully.');
};

// Get the schema file path from the command line arguments
const schemaFilePath = process.argv[2] || './prisma/schema.prisma';
runCodeGeneration(schemaFilePath);
