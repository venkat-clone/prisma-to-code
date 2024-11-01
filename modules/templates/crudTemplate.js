// Function to generate filters for integers



const generateFilter = (field, enumNames) => {

    if (enumNames.includes(field.type.replace('?', ''))) {

        return `{${field.name}: genarateEnumFilter(filters.${field.name})}`;
    }

    switch (field.type.replace('?', '')) {
        case 'Int':
            return `{${field.name}: generateIntegerFilter(filters.${field.name})}`;
        case 'Boolean':
            return `{${field.name}: generateBooleanFilter(filters.${field.name})}`;
        case 'Date':
            return `{${field.name}: generateDateFilter(filters.${field.name})}`;
        case 'String':
        case 'String?':
            return `{${field.name}: generateStringFilter(filters.${field.name})}`;

        default:
            return null;
    }
};




const crudTemplate = function (model, enums) {
    const enumNames = enums.map(enumValue => enumValue.name);
    const validDataTpes = [
        'Int',
        'Boolean',
        'Date',
        'String',
        ...enumNames,
    ]
    const validFields = model.fields
        .filter(field => validDataTpes.includes(field.type.replace('?', '')));

    console.log({ validFields, fields: model.fields, enums, enumNames });

    const searchFields = model.fields
        .filter(field => field.type === 'String' || field.type === 'String?')
        .map(field => `{${field.name}: { contains: search, mode: 'insensitive'} }`);
    return `
const { PrismaClient } = require('@prisma/client');
const { generateIntegerFilter, generateStringFilter, generateBooleanFilter,genarateEnumFilter } = require('../utils/filterUtils');

const prisma = new PrismaClient();

exports.create${model.name} = async (req, res) => {
    try {
        const result = await prisma.${model.name}.create({ data: req.body });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.get${model.name} = async (req, res) => {
    try {
     const { search, page = 1, limit = 10,  sortBy = 'id', sortOrder = 'asc',...filters } = req.query;

        const currentPage = Math.max(1, parseInt(page, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));

        const skip = (currentPage - 1) * pageSize;
        const take = pageSize;
         const where = {

        AND:[
         ${validFields
            .map(field => {
                const filter = generateFilter(field, enumNames);
                return `filters.${field.name}?${filter}:{}`;
            }).join(',\n            ')},].filter(Boolean),
         ${searchFields.length > 0 ? `OR:search
            ?  [ 
         ${searchFields
                .join(',\n            ')}]            : undefined,` : ``}
        };
           
const validSortFields = [${validFields.map(field => `"${field.name}"`).join(', ')}];
    const orderBy = validSortFields.includes(sortBy)
        ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' }
        : { id: 'asc' }; 

             const totalCount = await prisma.${model.name.toLowerCase()}.count({ where });
        const results = await prisma.${model.name.toLowerCase()}.findMany({
            where,
              skip,
            take,
               orderBy,
        });
           res.status(200).json({
            data: results,
            meta: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.update${model.name} = async (req, res) => {
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

exports.get${model.name}ById = async (req, res) => {
    try {
        const result = await prisma.${model.name}.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.delete${model.name} = async (req, res) => {
    try {
        const result = await prisma.${model.name}.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
`;
};

module.exports = {
    crudTemplate,
};
