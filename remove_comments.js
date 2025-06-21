const fs = require('fs');
const path = require('path');

function removeComments(content) {
    let result = content;

    // Remove single-line comments (// ...)
    result = result.replace(/\/\/.*$/gm, '');

    // Remove multi-line comments (/* ... */)
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove JSX comments ({/* ... */})
    result = result.replace(/{\/\*[\s\S]*?\*\/}/g, '');

    // Remove empty lines that might be left after comment removal
    result = result.replace(/^\s*[\r\n]/gm, '');

    return result;
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleanedContent = removeComments(content);
        fs.writeFileSync(filePath, cleanedContent);
        console.log(`✓ Processed: ${filePath}`);
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            walkDir(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            processFile(filePath);
        }
    });
}

console.log('Starting comment removal process...');
walkDir('.');
console.log('Comment removal completed!'); 