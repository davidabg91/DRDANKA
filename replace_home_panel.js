const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'ИИ ПРОЕКТИ', 'DANKA', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes('import RemotionVideoWidget')) {
  content = content.replace(
    'import { Suspense } from "react";',
    'import { Suspense } from "react";\nimport RemotionVideoWidget from "@/remotion/RemotionVideoWidget";'
  );
}

// 2. Remove old section
const searchStart = '{/* Hero Highlight Card - АБОНАМЕНТ БАБХ СПОКОЙСТВИЕ */}';
const searchEnd = '</div>\r?\n            </div>\r?\n          </div>\r?\n        </div>\r?\n      </section>';

const startIndex = content.indexOf(searchStart);

if (startIndex === -1) {
  console.error("Could not find start of old section");
  process.exit(1);
}

const beforeContent = content.substring(0, startIndex);
let afterContent = content.substring(startIndex);

const replaceRegex = /\{\/\* Hero Highlight Card - АБОНАМЕНТ БАБХ СПОКОЙСТВИЕ \*\/\}\r?\n\s*<div className="lg:col-span-5 relative group">[\s\S]*?\{\/\* CTA \*\/\}[\s\S]*?<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>/;

if (!replaceRegex.test(afterContent)) {
  console.error("Could not match the giant block via regex");
  process.exit(1);
}

afterContent = afterContent.replace(
  replaceRegex,
  `{/* Hero Highlight Card - Remotion Video */}
            <RemotionVideoWidget />`
);

fs.writeFileSync(filePath, beforeContent + afterContent, 'utf8');
console.log("Successfully replaced old subscription panel with RemotionVideoWidget!");
