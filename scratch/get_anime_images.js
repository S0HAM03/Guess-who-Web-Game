const google = require('googlethis');
const fs = require('fs');
const util = require('util');

const characters = [
  { id: 'naruto', name: 'Naruto', traits: { hair: 'blonde', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'goku', name: 'Goku', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'luffy', name: 'Luffy', traits: { hair: 'black', hat: true, beard: false, glasses: false, gender: 'male' } },
  { id: 'ichigo', name: 'Ichigo', traits: { hair: 'orange', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'deku', name: 'Deku', traits: { hair: 'green', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'levi', name: 'Levi', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'eren', name: 'Eren Yeager', traits: { hair: 'dark', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'sasuke', name: 'Sasuke', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'killua', name: 'Killua', traits: { hair: 'white', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'gon', name: 'Gon', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'zoro', name: 'Zoro', traits: { hair: 'green', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'vegeta', name: 'Vegeta', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'tanjiro', name: 'Tanjiro', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'zenitsu', name: 'Zenitsu', traits: { hair: 'blonde', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'inosuke', name: 'Inosuke', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'mikasa', name: 'Mikasa', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'female' } },
  { id: 'nezuko', name: 'Nezuko', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'female' } },
  { id: 'rem', name: 'Rem', traits: { hair: 'blue', hat: false, beard: false, glasses: false, gender: 'female' } },
  { id: 'sukuna', name: 'Sukuna', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'gojo', name: 'Gojo Satoru', traits: { hair: 'white', hat: false, beard: false, glasses: true, gender: 'male' } },
  { id: 'edward', name: 'Edward Elric', traits: { hair: 'blonde', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'spike', name: 'Spike Spiegel', traits: { hair: 'dark', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'mob', name: 'Mob', traits: { hair: 'black', hat: false, beard: false, glasses: false, gender: 'male' } },
  { id: 'hinata', name: 'Hinata', traits: { hair: 'dark', hat: false, beard: false, glasses: false, gender: 'female' } },
];

(async () => {
  let resultStr = '  anime: [\n';
  
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    try {
      // fetching good anime profile pictures
      const query = char.name + ' anime profile picture aesthetic icon';
      const images = await google.image(query, { safe: false });
      let url = images.length > 0 ? images[0].url : 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + char.id;
      
      const traitsStr = util.inspect(char.traits);
      resultStr += `    { id: '${char.id}', name: '${char.name}', image: '${url}', traits: ${traitsStr} },\n`;
      console.log(`Fetched ${char.name}`);
    } catch (e) {
      console.log(`Failed ${char.name}`, e);
    }
  }
  
  resultStr += '  ],\n';
  fs.writeFileSync('new_anime.txt', resultStr);
  console.log('Done. Check new_anime.txt');
})();
