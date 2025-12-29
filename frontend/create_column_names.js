import fs from "fs";
import path from "path";

const inputPath = path.resolve("../bgg_integration/constants/column_names.json");
const outputPath = path.resolve("src/components/utils/column_names.ts");
//
const json_column_names = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const unifiedObject = Object.values(json_column_names).reduce(
  (acc, obj) => ({ ...acc, ...obj }),
  {}
);

const fileContent = `
// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT
export const data = ${JSON.stringify(unifiedObject, null, 2)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent);

console.log("✅ column_names.ts succesfully generated");
console.log(unifiedObject)