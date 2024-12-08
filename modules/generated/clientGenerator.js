const fs = require('fs');
const path = require('path');
const { generateFile } = require('../utils/utils');
const { apiServiceTemplate, apiConfigTemplate } = require('../templates/apiServiceTemplate');
/**
 * Generates client code based on the schema.
 * @param {string} schemaFilePath - Path to the Prisma schema file.
 * @param {string} outputDir - Directory to save the generated client code.
 */
const generateClientCode = async (models, enums, outputPath) => {
    generateApiConfig(outputPath);

    models.forEach((model) => {
        generateApiServiceCode(model, enums, outputPath);
    });
};

// Generate a controller for each model
const generateApiServiceCode = (model, enums, outputPath) => {
    const content = apiServiceTemplate(model, enums);
    generateFile(outputPath, 'services', `${model.name.toLowerCase()}ApiService.js`, content);
    console.info(`Generated API service for ${model.name}`);
};

const generateApiConfig = (outputPath) => {
    const content = apiConfigTemplate();
    generateFile(outputPath, 'config', 'apiConfig.js', content);
    console.info(`Generated API config`);
}

module.exports = { generateClientCode };
