const { runCodeGeneration } = require('./app.js');

const schemaFilePath = process.argv[2] || path.resolve(__dirname, 'schema.prisma');
const outputDir = process.argv[3] || path.resolve(__dirname, 'd:\\venkey\\test\\src');

// Run the code generation process
runCodeGeneration(schemaFilePath, outputDir);
