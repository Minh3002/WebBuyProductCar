const fs = require('fs');
const path = require('path');

function fixMojibake(str) {
  return str.replace(/[^\x00-\x7F]+/g, (match) => {
    let bytes = [];
    for (let i = 0; i < match.length; i++) {
      let c = match.charCodeAt(i);
      if (c === 0x20AC) c = 0x80;
      else if (c === 0x201A) c = 0x82;
      else if (c === 0x0192) c = 0x83;
      else if (c === 0x201E) c = 0x84;
      else if (c === 0x2026) c = 0x85;
      else if (c === 0x2020) c = 0x86;
      else if (c === 0x2021) c = 0x87;
      else if (c === 0x02C6) c = 0x88;
      else if (c === 0x2030) c = 0x89;
      else if (c === 0x0160) c = 0x8A;
      else if (c === 0x2039) c = 0x8B;
      else if (c === 0x0152) c = 0x8C;
      else if (c === 0x017D) c = 0x8E;
      else if (c === 0x2018) c = 0x91;
      else if (c === 0x2019) c = 0x92;
      else if (c === 0x201C) c = 0x93;
      else if (c === 0x201D) c = 0x94;
      else if (c === 0x2022) c = 0x95;
      else if (c === 0x2013) c = 0x96;
      else if (c === 0x2014) c = 0x97;
      else if (c === 0x02DC) c = 0x98;
      else if (c === 0x2122) c = 0x99;
      else if (c === 0x0161) c = 0x9A;
      else if (c === 0x203A) c = 0x9B;
      else if (c === 0x0153) c = 0x9C;
      else if (c === 0x017E) c = 0x9E;
      else if (c === 0x0178) c = 0x9F;
      else if (c > 255) return match; // Not a CP1252 byte
      bytes.push(c);
    }
    const decoded = Buffer.from(bytes).toString('utf8');
    if (decoded.includes('\uFFFD')) return match;
    return decoded;
  });
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const fixed = fixMojibake(content);
      if (fixed !== content) {
        console.log(`Fixed: ${fullPath}`);
        fs.writeFileSync(fullPath, fixed, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done!');
