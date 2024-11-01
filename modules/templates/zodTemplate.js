const mapFieldTypeToZod = (type, defaultValue, updateSchema, enums) => {
    const isOptional = type.includes('?');
    const baseType = type.replace('?', ''); // Remove '?' to get the base type

    const enumNames = enums.map(enumValue => enumValue.name);
    let zodType;

    // Map base type to Zod type

    switch (baseType) {
        case 'String': zodType = 'z.string()'; break;
        case 'Int': zodType = 'z.number().int()'; break;
        case 'Float': zodType = 'z.number()'; break;
        case 'Boolean': zodType = 'z.boolean()'; break;
        case 'DateTime': zodType = 'z.date()'; break;
        default:
            zodType = '';
            if (enumNames.includes(baseType)) {
                const enumValue = enums.find(enumValue => enumValue.name === baseType);
                zodType = `z.enum(['${enumValue.values.join("', '")}'])`;
            }// Generic default
    }

    if (zodType === '') {
        return '';
    }

    if (defaultValue !== null) {
        zodType += `.default(${defaultValue})`;
    }
    // If type is optional, add `.optional()` to the Zod type
    return isOptional || updateSchema ? `${zodType}.optional()` : zodType;
};

const generateValidationSchema = (model, enums) => {
    const filteredFields = model.fields.filter(function (field) {

        if (field.type.includes('[]')) {
            return false;
        }

        if (mapFieldTypeToZod(field.type, null, false, enums) === '') {
            return false;
        }
        return !field.annotations.some(annotation => annotation.name === 'id' || annotation.name === 'relation');
    }
    );
    const fieldsSchema = filteredFields.map(field => {
        const defaultAnnotation = field.annotations.find(annotation => annotation.name === 'default');

        // Check if a 'default' annotation was found, and if so, access its value
        const defaultValue = defaultAnnotation ? defaultAnnotation.value : null;
        const zodType = mapFieldTypeToZod(field.type, defaultValue, false, enums);
        return `${field.name}: ${zodType}`;
    }).join(',\n    ');

    const updateFieldsSchema = filteredFields.map(field => {
        const defaultAnnotation = field.annotations.find(annotation => annotation.name === 'default');

        // Check if a 'default' annotation was found, and if so, access its value
        const defaultValue = defaultAnnotation ? defaultAnnotation.value : null;
        const zodType = mapFieldTypeToZod(field.type, defaultValue, true, enums);
        return `${field.name}: ${zodType}`;
    }).join(',\n    ');

    return `
const { z } = require('zod');
const ${model.name}Schema = z.object({
    ${fieldsSchema}
});

const update${model.name}Schema = z.object({
    ${updateFieldsSchema}
});

module.exports = {${model.name}Schema, update${model.name}Schema};
`;
};

module.exports = {
    mapFieldTypeToZod,
    generateValidationSchema
};
