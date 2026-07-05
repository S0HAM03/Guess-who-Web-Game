const fs = require('fs');

const charFile = 'd:/Web-Projects/Guess-who-website/client/src/data/characters.js';
let charContent = fs.readFileSync(charFile, 'utf8');

const newAnimeFile = 'd:/Web-Projects/Guess-who-website/new_anime.txt';
let newAnimeContent = fs.readFileSync(newAnimeFile, 'utf8');

const regex = /  anime: \[\s*([\s\S]*?)\s*\],/m;

if (regex.test(charContent)) {
  charContent = charContent.replace(regex, newAnimeContent.trim() + ',');
  fs.writeFileSync(charFile, charContent);
  console.log('Replaced anime category in characters.js');
} else {
  console.log('Regex did not match!');
}
