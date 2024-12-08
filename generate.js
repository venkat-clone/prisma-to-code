#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { runCodeGeneration } = require('./app.js');
const { generateClientCode } = require('./modules/generated/clientGenerator'); // Import the client code generator function

// Set up readline interface for user interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompts the user for input and returns their response.
 * @param {string} query - The question to ask the user.
 * @returns {Promise<string>} - The user's response.
 */
const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Displays help information to the user.
 */
const showHelp = () => {
    console.log(`
Usage: prisma-to-code <schema_file_path> <output_directory> [--generate-client]

Arguments:
  <schema_file_path>  Path to the Prisma schema file. (Default: './prisma/schema.prisma')
  <output_directory>  Directory where generated code should be saved. (Default: './src')

Options:
  --generate-client   Include generating client code along with other outputs.
  -h, --help          Show this help message.

Examples:
  prisma-to-code ./prisma/schema.prisma ./output --generate-client
  prisma-to-code (uses default paths and skips client generation)
    `);
};

// Parse command-line arguments
const args = process.argv.slice(2);
const isGenerateClient = args.includes('--generate-client');
const defaultSchemaPath = args[0] && !args[0].startsWith('-')
    ? path.resolve(process.cwd(), args[0])
    : path.resolve(process.cwd(), 'prisma/schema.prisma');
const defaultOutputDir = args[1] && !args[1].startsWith('-')
    ? path.resolve(process.cwd(), args[1])
    : path.resolve(process.cwd(), 'src');

// Show help message and exit if requested
if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
}

/**
 * Validates the schema path and output directory with user input.
 */
const validateAndRun = async () => {
    // Prompt user for schema file path with a default option
    const schemaFilePath = await askQuestion(`Enter schema file path (default: ${defaultSchemaPath}): `) || defaultSchemaPath;

    // Check if the schema file exists
    if (!fs.existsSync(schemaFilePath)) {
        console.error(`Error: Schema file not found at path: ${schemaFilePath}`);
        rl.close();
        process.exit(1);
    }

    // Prompt user for output directory with a default option
    const outputDir = await askQuestion(`Enter output directory (default: ${defaultOutputDir}): `) || defaultOutputDir;

    // Check if the output directory exists or prompt to create it
    if (!fs.existsSync(outputDir)) {
        const createDirResponse = await askQuestion(`Output directory does not exist. Do you want to create it at ${outputDir}? (yes/no): `);
        if (createDirResponse.toLowerCase() === 'yes') {
            try {
                fs.mkdirSync(outputDir, { recursive: true });
                console.log(`Output directory created at: ${outputDir}`);
            } catch (err) {
                console.error(`Error creating output directory at ${outputDir}:`, err.message);
                rl.close();
                process.exit(1);
            }
        } else {
            console.log('Output directory creation declined. Exiting.');
            rl.close();
            process.exit(1);
        }
    }

    // Start code generation
    console.log(`Starting code generation from schema: ${schemaFilePath}`);
    console.log(`Output directory: ${outputDir}`);
    try {


        // Generate client code if the option is selected
        console.log(`Generating ${isGenerateClient ? 'client ' : 'api'} code...`);
        await runCodeGeneration(schemaFilePath, outputDir, { generateClient: isGenerateClient });
        console.log('Client code generation completed successfully!');
        console.log(`Code generation completed successfully! Files saved to ${outputDir}`);

    } catch (error) {
        console.error('Code generation failed:', error.message);
    } finally {
        rl.close();
    }
};

// Start the validation and code generation process
validateAndRun();
