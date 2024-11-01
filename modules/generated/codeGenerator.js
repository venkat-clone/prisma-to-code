const fs = require('fs');
const path = require('path');
const { crudTemplate } = require('../templates/crudTemplate');
const { generateValidationSchema } = require('../templates/zodTemplate');
const { generateRoutesTemplate, generateMainRoutesFile } = require('../templates/routeTemplate');
const filterFunctionsTemplate = require('../templates/filterFunctionsTemplate');
const generateCode = (models, enums, outputPath) => {

    const filterUtilsPath = path.join(outputPath, 'utils', 'filterUtils.js');
    fs.mkdirSync(path.dirname(filterUtilsPath), { recursive: true });
    fs.writeFileSync(filterUtilsPath, filterFunctionsTemplate());



    models.forEach((model) => {
        const modelFilePath = path.join(outputPath, 'Controllers', `${model.name.toLowerCase()}Controller.js`);
        fs.mkdirSync(path.dirname(modelFilePath), { recursive: true });
        fs.writeFileSync(modelFilePath, crudTemplate(model, enums));
        console.log(`Generated CRUD for model ${model.name}`);

        const validationFilePath = path.join(outputPath, 'Validation', `${model.name.toLowerCase()}Validation.js`);
        fs.mkdirSync(path.dirname(validationFilePath), { recursive: true });
        fs.writeFileSync(validationFilePath, generateValidationSchema(model, enums));
        console.log(`Generated validation schema for model ${model.name}`);


        const routesFilePath = path.join(outputPath, 'routes', `${model.name.toLowerCase()}Routes.js`);
        fs.mkdirSync(path.dirname(routesFilePath), { recursive: true });
        fs.writeFileSync(routesFilePath, generateRoutesTemplate(model));
        console.log(`Generated routes for model ${model.name}`);

    });
    const routesIndexPath = path.join(outputPath, 'routes', `index.js`);
    fs.mkdirSync(path.dirname(routesIndexPath), { recursive: true });
    fs.writeFileSync(path.join(routesIndexPath), generateMainRoutesFile(models));
    console.log(`Generated main routes for models`);

};

module.exports = {
    generateCode,
};
