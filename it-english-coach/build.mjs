/* Inlines styles.css and the js/ files into one standalone HTML file.
   Run: npm run build  ->  dist/it-english-coach.html                      */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = f => fs.readFileSync(path.join(root, f), "utf8");

let html = read("index.html");

html = html.replace(
  /<link rel="stylesheet" href="styles\.css">/,
  () => `<style>\n${read("styles.css")}\n</style>`
);

html = html.replace(
  /<script src="(js\/[^"]+)"><\/script>/g,
  (_, src) => `<script>\n${read(src)}\n</script>`
);

// Base64, not a raw `data:image/svg+xml,<svg ...>` URI. Chromium's parser drops a
// link whose attribute value contains raw `<`/`>` and closes <head> early.
html = html.replace(
  /href="favicon\.svg"/,
  () => `href="data:image/svg+xml;base64,${fs.readFileSync(path.join(root, "favicon.svg")).toString("base64")}"`
);

const missed = html.match(/<(?:script src|link rel="stylesheet")[^>]*>|href="favicon\.svg"/g);
if (missed) {
  console.error("Unbundled asset reference left in output:", missed);
  process.exit(1);
}

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
const out = path.join(root, "dist", "it-english-coach.html");
fs.writeFileSync(out, html);
console.log(`dist/it-english-coach.html  ${(html.length / 1024).toFixed(0)} KB`);
