const fs = require('fs');

const lines = fs.readFileSync('src/app/page.tsx', 'utf8').split(/\r?\n/);

// Remove lines 188 to 292 (0-indexed: 187 to 291)
// Splice out 291 - 187 + 1 = 105 lines
lines.splice(187, 105, 
  '            {/* Hero Highlight Card - Remotion Video */}',
  '            <RemotionVideoWidget />'
);

// Add import if missing
let hasImport = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('import RemotionVideoWidget')) {
    hasImport = true;
    break;
  }
}
if (!hasImport) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 'import { Suspense } from "react";') {
      lines.splice(i + 1, 0, 'import RemotionVideoWidget from "@/remotion/RemotionVideoWidget";');
      break;
    }
  }
}

fs.writeFileSync('src/app/page.tsx', lines.join('\n'));
console.log("Spliced exactly 105 lines (188 to 292).");
