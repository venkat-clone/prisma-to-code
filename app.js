const fs = require('fs');
const path = require('path');
const prisma = require('@prisma/client');

// Load Prisma schema (parse the file and extract model details)
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

// Basic model parsing (you might need a library or regex to extract models more accurately)
const models = schemaContent.match(/model\s+\w+\s+\{/g).map(model => model.split(' ')[1]);

// Template for CRUD controllers
const crudTemplate = (model) => `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create${model} = async (req, res) => {
    try {
        const result = await prisma.${model.toLowerCase()}.create({ data: req.body });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Other CRUD operations (read, update, delete) can follow a similar pattern
`;

// Generate CRUD files for each model
models.forEach((model) => {
    const modelFilePath = path.join(__dirname, 'generated', `${model}Controller.js`);
    fs.writeFileSync(modelFilePath, crudTemplate(model));
    console.log(`Generated CRUD for model ${model}`);
});
