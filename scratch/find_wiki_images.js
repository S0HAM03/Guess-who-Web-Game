const fs = require('fs');
const path = require('path');

// Read the modified characters file
const charPath = path.join(__dirname, '../client/src/data/characters.js');
let content = fs.readFileSync(charPath, 'utf8');

// We can just extract the names using a regex for a quick check
const nameRegex = /name:\s*'([^']+)'/g;
let match;
let names = [];
while ((match = nameRegex.exec(content)) !== null) {
  // Exclude category names that appear in CATEGORIES definition
  if (!['S8UL Creators', 'Indian YouTubers', 'Indian Gamers', 'Top Global Creators', 'Streamers', 'Indian Cricketers', 'Indian Movie Stars', 'Footballers', 'Actors'].includes(match[1])) {
    names.push(match[1]);
  }
}

async function fetchWikiImage(name) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500&redirects=1`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log(`Checking ${names.length} characters for Wikipedia images...`);
  let found = 0;
  // Let's just check the first 20 as a sample to show the user
  const sample = names.slice(0, 20);
  for (const name of sample) {
    const img = await fetchWikiImage(name);
    if (img) {
      console.log(`[FOUND] ${name}: ${img}`);
      found++;
    } else {
      console.log(`[MISSING] ${name}`);
    }
  }
  console.log(`\nSample result: Found ${found} out of ${sample.length}`);
}

main();
