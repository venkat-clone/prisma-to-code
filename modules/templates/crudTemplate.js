const generateFilter = (field, enumNames) => {
    const baseType = field.type.replace('?', '');

    if (enumNames.includes(baseType)) {
        return `{${field.name}: generateEnumFilter(filters.${field.name})}`;
    }

    const filterMapping = {
        'Int': 'generateIntegerFilter',
        'Boolean': 'generateBooleanFilter',
        'Date': 'generateDateFilter',
        'String': 'generateStringFilter'
    };

    const filterFunction = filterMapping[baseType];
    return filterFunction ? `{${field.name}: ${filterFunction}(filters.${field.name})}` : null;
};

const crudTemplate = (model, enums) => {
    const enumNames = enums.map(enumObj => enumObj.name);
    const validFields = model.fields.filter(field => ['Int', 'Boolean', 'Date', 'String', ...enumNames]
        .includes(field.type.replace('?', ''))
    );

    const searchFields = model.fields
        .filter(field => field.type.includes('String'))
        .map(field => `{ ${field.name}: { contains: search, mode: 'insensitive' } }`);

    return `
const { PrismaClient } = require('@prisma/client');
const { generateIntegerFilter, generateStringFilter, generateBooleanFilter, generateEnumFilter } = require('../utils/filterUtils');

const prisma = new PrismaClient();

const create${model.name} = async (req, res) => {
    try {
        const result = await prisma.${model.name}.create({ data: req.body });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const get${model.name} = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc', ...filters } = req.query;
        const currentPage = Math.max(1, parseInt(page, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));
        const skip = (currentPage - 1) * pageSize;
        
        const where = {
            AND: [
                ${validFields.map(field => {
        const filter = generateFilter(field, enumNames);
        return `filters.${field.name} ? ${filter} : {}`;
    }).join(',\n')}
            ].filter(Boolean),
            ${searchFields.length > 0 ? `OR: search ? [ ${searchFields.join(', ')} ] : undefined,` : ''}
        };
        const validFields = [${validFields.map(field => `"${field.name}"`).join(', ')}];
        const orderBy = validFields.includes(sortBy) ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' } : { id: 'asc' };

        const totalCount = await prisma.${model.name.toLowerCase()}.count({ where });
        const results = await prisma.${model.name.toLowerCase()}.findMany({
            where,
            skip,
            take: pageSize,
            orderBy
        });

        res.status(200).json({
            data: results,
            meta: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                currentPage,
                pageSize
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const update${model.name} = async (req, res) => {
    try {
        const result = await prisma.${model.name}.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const get${model.name}ById = async (req, res) => {
    try {
        const result = await prisma.${model.name}.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const delete${model.name} = async (req, res) => {
    try {
        const result = await prisma.${model.name}.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    create${model.name},
    get${model.name},
    update${model.name},
    get${model.name}ById,
    delete${model.name}
};
`;
};

module.exports = {
    crudTemplate,
};
