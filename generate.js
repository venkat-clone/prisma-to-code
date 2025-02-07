#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { runCodeGeneration } = require('./app.js');
const { cliOptions, defaultPaths } = require('./config/options');
const OptionsManager = require('./utils/OptionsManager');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Initialize options manager
const optionsManager = new OptionsManager(cliOptions, defaultPaths);
const args = process.argv.slice(2);

// Show help message and exit if requested
if (args.includes('-h') || args.includes('--help')) {
    console.log(optionsManager.generateHelpText());
    process.exit(0);
}

// Parse command line arguments
const options = optionsManager.parseArguments(args);

const validateAndRun = async () => {
    // Validate schema path
    const schemaFilePath = await askQuestion(`Enter schema file path (default: ${options.schemaPath}): `) || options.schemaPath;
    if (!fs.existsSync(schemaFilePath)) {
        console.error(`Error: Schema file not found at path: ${schemaFilePath}`);
        rl.close();
        process.exit(1);
    }

    // Validate output directory
    const outputDir = await askQuestion(`Enter output directory (default: ${options.outputDir}): `) || options.outputDir;
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

    // Prompt for any missing options
    await optionsManager.promptForMissingOptions(askQuestion);
    const finalOptions = optionsManager.getOptions();

    // Start code generation
    // console.log('\nStarting code generation with options:', finalOptions);
    
    try {
        await runCodeGeneration(finalOptions);
        console.log('Code generation completed successfully!');
        console.log(`Files saved to ${outputDir}`);
    } catch (error) {
        console.error('Code generation failed:', error.message);
    } finally {
        rl.close();
    }
};

validateAndRun();
