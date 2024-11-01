const generateRoutesTemplate = (model) => `
const express = require('express');
const router = express.Router();
const {${model.name}Schema,update${model.name}Schema}  = require('../validation/${model.name.toLowerCase()}Validation');
const ${model.name.toLowerCase()}Controller = require('../controllers/${model.name.toLowerCase()}Controller');

// Middleware for validation
const validateRequest = (schema) => (req, res, next) => {
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
    }
    next();
};


// Define routes for ${model.name}
router.get('/', ${model.name.toLowerCase()}Controller.get${model.name});
router.post('/', validateRequest(${model.name}Schema), ${model.name.toLowerCase()}Controller.create${model.name});
router.get('/:id', ${model.name.toLowerCase()}Controller.get${model.name}ById);
router.put('/:id', validateRequest(update${model.name}Schema), ${model.name.toLowerCase()}Controller.update${model.name});
router.delete('/:id', ${model.name.toLowerCase()}Controller.delete${model.name});

module.exports = router;
`;


const generateMainRoutesFile = (models) => `
// Automatically generated route exports
var express = require('express');
const indexRouter = express.Router();

${models
    .map(
      model =>
        `const ${model.name.toLowerCase()}Routes = require('./${model.name.toLowerCase()}Routes');`
    )
    .join('\n')}

indexRouter.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = {
  ${models.map(model => `${model.name.toLowerCase()}Routes`).join(',\n  ')},
  indexRouter
};
`;


module.exports = {
  generateRoutesTemplate,
  generateMainRoutesFile,
};