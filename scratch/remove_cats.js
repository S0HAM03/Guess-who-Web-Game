const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/data/characters.js');
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to remove categories from CATEGORIES array
content = content.replace(/[\s]*\{\s*id:\s*'anime',[\s\S]*?\},/g, '');
content = content.replace(/[\s]*\{\s*id:\s*'superheroes',[\s\S]*?\},/g, '');

// Use regex to remove characters from CHARACTERS_BY_CATEGORY
content = content.replace(/[\s]*anime:\s*\[[\s\S]*?\],/g, '');
content = content.replace(/[\s]*superheroes:\s*\[[\s\S]*?\],/g, '');

fs.writeFileSync(filePath, content);
console.log('Successfully removed anime and superheroes');
