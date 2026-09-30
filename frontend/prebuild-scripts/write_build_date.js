const fs = require('fs');
const d = new Date();
const dd = d.getDate().toString().padStart(2, '0');
const mm = (d.getMonth() + 1).toString().padStart(2, '0');
const yyyy = d.getFullYear();
const dateStr = `${dd} / ${mm} / ${yyyy}`;
fs.writeFileSync('src/components/utils/build-date.ts', `// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT
export const BUILD_DATE = '${dateStr}';\n`);
console.log(`Build date written: ${dateStr}`);
