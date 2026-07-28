const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\a374eea4-1b9f-4ed0-80a5-7a24a060b23b\\flawless_domain_og_banner_1785272530320.jpg';
const dest1 = path.join(__dirname, 'public', 'share-logo.jpg');
const dest2 = path.join(__dirname, 'public', 'og-image.jpg');

fs.copyFileSync(src, dest1);
fs.copyFileSync(src, dest2);
console.log('Images updated successfully!');
