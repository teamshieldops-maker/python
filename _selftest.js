// Extract env + lessons and emit files for the Python self-test.
const fs = require("fs");
function hoist(s) {
  return s
    .replace(/const WORLDS/, "global.WORLDS")
    .replace(/const LESSONS/, "global.LESSONS")
    .replace(/const ENV_PYTHON/, "global.ENV_PYTHON");
}
eval(hoist(fs.readFileSync(__dirname + "/env.js", "utf8")));
eval(hoist(fs.readFileSync(__dirname + "/lessons.js", "utf8")));

fs.writeFileSync(__dirname + "/_env.py", global.ENV_PYTHON);
const out = global.LESSONS.map(l => ({ id: l.id, title: l.title, starter: l.starter, solution: l.solution, check: l.check }));
fs.writeFileSync(__dirname + "/_lessons.json", JSON.stringify(out, null, 2));
console.log("wrote env +", out.length, "lessons");
