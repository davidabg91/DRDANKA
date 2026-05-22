const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'ИИ ПРОЕКТИ', 'DANKA', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split(/\r?\n/);

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Hero Highlight Card - АБОНАМЕНТ БАБХ СПОКОЙСТВИЕ */}')) {
    startIndex = i;
  }
}

// We know the end index is line 292 (which is index 291), but we can find it structurally:
// From startIndex, find the first line that is `            </div>` and the next is `          </div>` and the next is `        </div>`
if (startIndex !== -1) {
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].trim() === '</div>' && lines[i+1].trim() === '</div>' && lines[i+2].trim() === '</div>' && lines[i+3].trim() === '</section>') {
      // lines[i] is line 293
      // lines[i-1] is line 292 (closes lg:col-span-5)
      endIndex = i - 1;
      break;
    }
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1,
    '            {/* Hero Highlight Card - Remotion Video */}',
    '            <RemotionVideoWidget />'
  );
  console.log("Successfully replaced block from " + startIndex + " to " + endIndex);
} else {
  console.log("Could not find block boundaries!");
  process.exit(1);
}

// Add import
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

fs.writeFileSync(filePath, lines.join('\n'));
