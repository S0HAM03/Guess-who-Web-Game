const google = require('googlethis');
const fs = require('fs');

const heroes = [
  'Spider-Man', 'Batman', 'Superman', 'Wonder Woman', 'Iron Man', 'Captain America', 'Thor', 'Wolverine',
  'The Flash', 'Hulk', 'Deadpool', 'Black Panther', 'Aquaman', 'Green Lantern', 'Doctor Strange', 'Black Widow',
  'Scarlet Witch', 'Daredevil', 'professor x', 'Captain Marvel', 'Ant-Man', 'Nightwing', 'Shazam', 'Supergirl'
];

(async () => {
  let resultStr = '  superheroes: [\n';
  
  for (let i = 0; i < heroes.length; i++) {
    const name = heroes[i];
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    try {
      const images = await google.image(name + ' superhero movie face portrait', { safe: false });
      let url = images.length > 0 ? images[0].url : 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + name;
      
      resultStr += `    { id: '${id}', name: '${name} superhero', image: '${url}' },\n`;
      console.log(`Fetched ${name}`);
    } catch (e) {
      console.log(`Failed ${name}`, e);
    }
  }
  
  resultStr += '  ],\n';
  fs.writeFileSync('new_superheroes.txt', resultStr);
  console.log('Done.');
})();
