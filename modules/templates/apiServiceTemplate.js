const apiConfigTemplate = () => `

const axios = require('axios');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:6000';
// Export configuration settings
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const config = {
    apiBaseUrl: API_BASE_URL,
    apiClient,
};

export default config;

`;

const apiServiceTemplate = (model) => {
    const modelName = model.name;
    return `
const { apiClient } = require('../config/apiConfig');

// API Service methods for ${modelName} operations
const ${modelName}Service = {
    // Fetch ${modelName}s with filters, pagination, sorting, and search
    get${modelName}s({ search, page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc', filters = {} }) {
        // Create a query string for search and filters
        const queryParams = new URLSearchParams({
            search: search || '',
            page,
            limit,
            sortBy,
            sortOrder,
            ...filters,
        }).toString();

        return apiClient.get(\`/${modelName}?\${queryParams}\`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching ${modelName}s:', error);
                throw error;
            });
    },

    // Fetch a specific ${modelName} by ID
    get${modelName}ById(${modelName}Id) {
        return apiClient.get(\`/${modelName}/\${${modelName}Id}\`)
            .then(response => response.data)
            .catch(error => {
                console.error(\`Error fetching ${modelName} with ID \${${modelName}Id}:\`, error);
                throw error;
            });
    },

    // Create a new ${modelName}
    create${modelName}(${modelName}Data) {
        return apiClient.post(\`/${modelName}\`, ${modelName}Data)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating ${modelName}:', error);
                throw error;
            });
    },

    // Update a ${modelName} by ID
    update${modelName}(${modelName}Id, ${modelName}Data) {
        return apiClient.put(\`/${modelName}/\${${modelName}Id}\`, ${modelName}Data)
            .then(response => response.data)
            .catch(error => {
                console.error(\`Error updating ${modelName} with ID \${${modelName}Id}:\`, error);
                throw error;
            });
    },

    // Delete a ${modelName} by ID
    delete${modelName}(${modelName}Id) {
        return apiClient.delete(\`/${modelName}/\${${modelName}Id}\`)
            .then(response => response.data)
            .catch(error => {
                console.error(\`Error deleting ${modelName} with ID \${${modelName}Id}:\`, error);
                throw error;
            });
    },
};

export default ${modelName}Service;
    `;
};

module.exports = {
    apiServiceTemplate,
    apiConfigTemplate
}