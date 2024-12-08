const fs = require('fs');
const path = require('path');
// Generic function to create directories and write files
const generateFile = (baseDir, subDir, fileName, content) => {
    const filePath = path.join(baseDir, subDir, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
};

module.exports = { generateFile };