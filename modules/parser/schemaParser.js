const fs = require('fs');

const parseSchema = (schemaFilePath) => {
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
    return {
        models: parseModels(schemaContent),
        enums: parseEnums(schemaContent)
    };
};

// Function to parse models from the schema
const parseModels = (schemaContent) => {
    const modelRegex = /model\s+(\w+)\s+{([^}]*)}/gs;
    const models = [];
    let match;

    while ((match = modelRegex.exec(schemaContent)) !== null) {
        const modelName = match[1];
        const modelBody = match[2];
        const fields = parseFields(modelBody);
        models.push({ name: modelName, fields });
    }

    return models;
};

// Generic field parser
const parseFields = (modelBody) => {
    const fieldRegex = /(\w+)\s+([\w\[\]?]+)\s*((?:@\w+(?:\([^)]*\))?\s*)*)/g;
    const fields = [];
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2];
        const annotations = parseAnnotations(fieldMatch[3]);
        fields.push({ name: fieldName, type: fieldType, annotations });
    }

    return fields;
};

// Generic annotation parser
const parseAnnotations = (annotationsText) => {
    const annotationRegex = /@(\w+)(?:\(([^)]*)\))?/g;
    const annotations = [];
    let annotationMatch;

    while ((annotationMatch = annotationRegex.exec(annotationsText)) !== null) {
        const annotationName = annotationMatch[1];
        const annotationValue = annotationMatch[2] ? annotationMatch[2].trim() : null;
        annotations.push({ name: annotationName, value: annotationValue });
    }

    return annotations;
};

// Function to parse enums from the schema
const parseEnums = (schemaContent) => {
    const enumRegex = /enum\s+(\w+)\s+{([^}]*)}/gs;
    const enums = [];
    let enumMatch;

    while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
        const enumName = enumMatch[1];
        const enumValues = parseEnumValues(enumMatch[2]);
        enums.push({ name: enumName, values: enumValues });
    }

    return enums;
};

// Helper to parse individual enum values
const parseEnumValues = (enumValuesText) => {
    return enumValuesText
        .split('\n')
        .map(value => value.trim())
        .filter(value => value !== '');
};

module.exports = {
    parseSchema,
};
