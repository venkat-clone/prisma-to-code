

const filterFunctionsTemplate = () => {
    return `const generateIntegerFilter = (field) => {
    const filters = {};
    if (field) {
        if (field.includes('>')) filters.gt = Number(field.replace('>', ''));
        if (field.includes('<')) filters.lt = Number(field.replace('<', ''));
        if (field.includes('>=')) filters.gte = Number(field.replace('>=', ''));
        if (field.includes('<=')) filters.lte = Number(field.replace('<=', ''));
        if (field.includes('!=')) filters.not = Number(field.replace('!=', ''));
        if (field.includes('in:')) filters.in = field.replace('in:', '').split(',').map(Number);
        if (field.includes('=')) filters.equals = Number(field.replace('=', ''));
    }
    return Object.keys(filters).length ? filters : {};
};

// Function to generate filters for booleans
const generateBooleanFilter = (field) => {

    const fieldName = field.name;
    if (field === 'true') return true;
    if (field === 'false') return false;
    if (field === 'null') return null;
    if (field === 'notnull') return { not: null };
    return {};
};

// Function to generate filters for dates
const generateDateFilter = (field) => {
    const filters = {};
    if (field) {
        if (field.includes('=')) filters.equals = new Date(field.replace('=', ''));
        if (field.includes('>')) filters.gt = new Date(field.replace('>', ''));
        if (field.includes('<')) filters.lt = new Date(field.replace('<', ''));
        if (field.includes('between:')) {
            const dates = field.split(':')[1].split(',');
            filters.gte = new Date(dates[0]);
            filters.lte = new Date(dates[1]);
        }
        if (field === 'null') filters.equals = null;
        if (field === 'notnull') filters.not = null;
    }


    return Object.keys(filters).length ? filters : {};
};

// Function to generate filters for strings
const generateStringFilter = (name) => {
    var filters = {};
    if (name === 'null') filters.equals = null;
    if (name === 'notnull') filters.not = null;
    if (name) filters = { contains: name, mode: 'insensitive' };
    return Object.keys(filters).length ? filters : {};
}; 

const genarateEnumFilter = (name) => {
    var filters = {};
     var filters = {};
    if (name === 'null') filters.equals = null;
    if (name === 'notnull') filters.not = null;
    if (name) filters.equals = name;
    return Object.keys(filters).length ? filters : {};
}

module.exports = {
    generateIntegerFilter,
    generateBooleanFilter,
    generateDateFilter,
    generateStringFilter,
    genarateEnumFilter
}

`;
}



module.exports = filterFunctionsTemplate;