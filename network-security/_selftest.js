// Node self-test: validates the engine + every lesson's solution.
const fs = require("fs");
const NetEngine = require("./engine.js");

// load lessons.js (hoist its consts to global)
let src = fs.readFileSync(__dirname + "/lessons.js", "utf8");
src = src.replace(/const WORLDS/, "global.WORLDS").replace(/const LESSONS/, "global.LESSONS");
eval(src);
const LESSONS = global.LESSONS;

let fails = 0;
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, "");

// 1) sanity-check the subnet engine against known truths
const engineChecks = [
  ["192.168.10.37/27 network", NetEngine.parseCidr("192.168.10.37/27").network, "192.168.10.32"],
  ["10.0.0.0/22 broadcast", NetEngine.parseCidr("10.0.0.0/22").broadcast, "10.0.3.255"],
  ["172.16.5.0/28 first", NetEngine.parseCidr("172.16.5.0/28").firstHost, "172.16.5.1"],
  ["172.16.5.0/28 last", NetEngine.parseCidr("172.16.5.0/28").lastHost, "172.16.5.14"],
  ["/24 mask", NetEngine.parseCidr("1.1.1.0/24").mask, "255.255.255.0"],
  ["/27 usable", String(NetEngine.parseCidr("1.1.1.0/27").usableHosts), "30"],
  ["prefixForHosts(50)", "/" + NetEngine.prefixForHosts(50), "/26"],
  [".130 in .128/26", String(NetEngine.ipInCidr("192.168.1.130", "192.168.1.128/26")), "true"],
];
console.log("== engine math ==");
engineChecks.forEach(([label, got, want]) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  [${ok ? "OK" : "FAIL"}] ${label}: ${got} (want ${want})`);
});

// 2) per-lesson checks
console.log("\n== lessons ==");
for (const l of LESSONS) {
  let ok = true, note = "";
  if (l.kind === "quiz") {
    ok = Number.isInteger(l.answer) && l.answer >= 0 && l.answer < (l.options || []).length && l.options.length >= 2;
    if (!ok) note = "answer index out of range";
  } else if (l.kind === "fill") {
    for (const f of l.fields) {
      if (!f.answers || !f.answers.length) { ok = false; note = "no answers for " + f.id; }
    }
  } else if (l.kind === "firewall") {
    const { results, errors } = NetEngine.evaluate(l.solution, l.flows);
    if (errors.length) { ok = false; note = "solution parse error: " + errors[0].msg; }
    else {
      const bad = results.filter(r => !r.correct);
      if (bad.length) { ok = false; note = `solution fails flow "${bad[0].flow.desc}" (got ${bad[0].result}, want ${bad[0].flow.expect})`; }
    }
    // starter should NOT already pass (otherwise the quest is trivial)
    if (ok && l.starter !== undefined) {
      const sres = NetEngine.evaluate(l.starter, l.flows);
      const starterPasses = !sres.errors.length && sres.results.every(r => r.correct);
      if (starterPasses) note += " [warn: starter already passes]";
    }
  }
  if (!ok) fails++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${l.id.padStart(3)} ${l.title}${note ? "  ->  " + note : ""}`);
}

console.log("\n" + (fails === 0 ? "ALL CHECKS PASS ✅" : `${fails} FAILURE(S) ❌`));
process.exit(fails ? 1 : 0);
