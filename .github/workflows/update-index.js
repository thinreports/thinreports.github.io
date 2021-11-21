const { readFileSync, writeFileSync } = require('fs');
const https = require('https');

const README_URL = 'https://raw.githubusercontent.com/thinreports/thinreports/main/README.md';
const INDEX_PATH = 'index.md';

async function getReadme() {
  return new Promise((resolve, reject) => {
    https.get(README_URL, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      } else {
        reject(new Error(res.statusMessage));
      }
    }).on('error', e => reject(e));
  });
}

function buildIndexWith(readme) {
  const index = readFileSync(INDEX_PATH, { encoding: 'utf-8' });
  const header = index.match(/^\-\-\-[\s\S]+\-\-\-/m)[0];

  return [header, readme].join("\n\n");
}

(async () => {
  const readme = await getReadme();
  const newIndex = buildIndexWith(readme);

  writeFileSync(INDEX_PATH, newIndex);
})();
