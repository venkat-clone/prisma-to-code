const fs = require('fs');
const path = require('path');
const { crudTemplate } = require('../templates/crudTemplate');
const { generateValidationSchema } = require('../templates/zodTemplate');
const { generateRoutesTemplate, generateMainRoutesFile } = require('../templates/routeTemplate');
const filterFunctionsTemplate = require('../templates/filterFunctionsTemplate');
const { generateFile } = require('../utils/utils');
const generateCode = (models, enums, outputPath) => {
    // Generate utility files
    generateFile(outputPath, 'utils', 'filterUtils.js', filterFunctionsTemplate());

    // Generate model-specific files
    models.forEach((model) => {
        generateController(model, enums, outputPath);
        generateValidation(model, enums, outputPath);
        generateRoutes(model, outputPath);
    });

    // Generate main routes index
    generateFile(outputPath, 'routes', 'index.js', generateMainRoutesFile(models));
    console.log('Generated main routes for all models');
};



// Generate a controller for each model
const generateController = (model, enums, outputPath) => {
    const content = crudTemplate(model, enums);
    generateFile(outputPath, 'Controllers', `${model.name.toLowerCase()}Controller.js`, content);
    console.log(`Generated CRUD for model ${model.name}`);
};

// Generate a validation schema for each model
const generateValidation = (model, enums, outputPath) => {
    const content = generateValidationSchema(model, enums);
    generateFile(outputPath, 'Validation', `${model.name.toLowerCase()}Validation.js`, content);
    console.log(`Generated validation schema for model ${model.name}`);
};

// Generate routes for each model
const generateRoutes = (model, outputPath) => {
    const content = generateRoutesTemplate(model);
    generateFile(outputPath, 'routes', `${model.name.toLowerCase()}Routes.js`, content);
    console.log(`Generated routes for model ${model.name}`);
};

module.exports = {
    generateCode,
};
