const fs = require('fs');

const parseSchema = (schemaFilePath) => {
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');

    const modelRegex = /model\s+(\w+)\s+{([^}]*)}/gs;
    const models = [];
    let match;

    while ((match = modelRegex.exec(schemaContent)) !== null) {
        const modelName = match[1];
        const modelBody = match[2];

        // Parse fields, including optional, array, and annotated fields
        const fields = [];
        const fieldRegex = /(\w+)\s+([\w\[\]?]+)\s*((?:@\w+(?:\([^)]*\))?\s*)*)/g;
        let fieldMatch;

        while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
            const fieldName = fieldMatch[1];
            const fieldType = fieldMatch[2];
            const annotationsText = fieldMatch[3];

            // Parse annotations from the annotationsText
            const annotations = [];
            const annotationRegex = /@(\w+)(?:\(([^)]*)\))?/g;
            let annotationMatch;
            while ((annotationMatch = annotationRegex.exec(annotationsText)) !== null) {
                const annotationName = annotationMatch[1];
                const annotationValue = annotationMatch[2] ? annotationMatch[2].trim() : null;
                annotations.push({ name: annotationName, value: annotationValue });
            }

            fields.push({ name: fieldName, type: fieldType, annotations });
        }

        models.push({ name: modelName, fields });
    }


    const enumRegex = /enum\s+(\w+)\s+{([^}]*)}/gs;
    const enums = [];
    let enumMatch;

    while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
        const enumName = enumMatch[1];
        const enumValuesText = enumMatch[2];

        // Parse enum values
        const enumValues = enumValuesText
            .split('\n')
            .map(value => value.trim())
            .filter(value => value !== '');

        enums.push({ name: enumName, values: enumValues });
    }



    return { models, enums };
};

module.exports = {
    parseSchema,
};
