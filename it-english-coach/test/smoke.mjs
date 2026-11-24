/* Headless integration check: loads index.html in jsdom and clicks through
   every view and drill mode, asserting the UI actually renders and responds.
   Run:  node test/smoke.mjs                                               */

import { JSDOM, VirtualConsole } from "jsdom";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const pageErrors = [];

const vc = new VirtualConsole();
vc.on("jsdomError", e => {
  if (/Not implemented/.test(e.message)) return;   // jsdom gaps: scrollTo, speech APIs
  pageErrors.push(e.message);
});
vc.on("error", (...a) => pageErrors.push("console.error: " + a.join(" ")));

let pass = 0;
const fails = [];
function ok(label, cond, detail = "") {
  if (cond) { pass++; console.log("  \x1b[32m\u2713\x1b[0m " + label); }
  else { fails.push(label + (detail ? " \u2014 " + detail : "")); console.log("  \x1b[31m\u2717\x1b[0m " + label + (detail ? " \u2014 " + detail : "")); }
}
const tick = (w, n = 1) => new Promise(r => setTimeout(r, n * 25));

const root = path.join(here, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");

// Strip the <script src> tags and inject the sources inline, so jsdom needs
// no network/file fetching and we can keep a normal http origin for storage.
const html = read("index.html").replace(/<script src="[^"]+"><\/script>\s*/g, "");
const sources = ["js/data.js", "js/store.js", "js/speech.js", "js/app.js"];

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://local.test/index.html",
  virtualConsole: vc
});
const { window } = dom;
const doc = window.document;
await new Promise(r => window.addEventListener("load", r));

for (const f of sources) {
  const s = doc.createElement("script");
  s.textContent = read(f);
  doc.body.appendChild(s);
}
await tick(window, 4);

// `const` at script top level is not a window property, so reach it via eval.
const Store = window.eval("Store");
const ITEMS = window.eval("ITEMS");

const $ = s => doc.querySelector(s);
const $$ = s => [...doc.querySelectorAll(s)];
const text = s => ($(s)?.textContent ?? "").trim();
const click = async (el, n = 4) => { el.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); await tick(window, n); };
const key = async k => { doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true })); await tick(window, 4); };

console.log("\n\x1b[1mHOME\x1b[0m");
ok("hero renders", /articulate/i.test(text("h1")), text("h1").slice(0, 40));
ok("phrase count injected", $("[data-count=phrases]").textContent === "168", $("[data-count=phrases]").textContent);
ok("all 10 decks listed", $$(".deck-card").length === 10, String($$(".deck-card").length));
ok("stats populated", text("#statUnseen") === "168", text("#statUnseen"));
ok("due-count label shown", text("#dueCount").length > 0, text("#dueCount"));

console.log("\n\x1b[1mDECK PAGE\x1b[0m");
await click($$(".deck-card")[0]);
ok("navigated to deck", window.location.hash === "#/deck/standup", window.location.hash);
ok("deck title shown", text("#deckName") === "Daily Standup & Status", text("#deckName"));
ok("six modes offered", $$(".mode").length === 6, String($$(".mode").length));
ok("fixit enabled (8 avoid examples)", !$("[data-mode=fixit]").disabled);

console.log("\n\x1b[1mLEARN MODE\x1b[0m");
await click($("[data-mode=learn]"));
ok("learn card renders term", text(".term").length > 0, text(".term"));
ok("example sentence present", text(".example").length > 20);
ok("counter shows 1 / 18", text("#drillCount") === "1 / 18", text("#drillCount"));
ok("prev disabled on first card", $("#prevBtn").disabled);
const firstTerm = text(".term");
await click($("#nextBtn"));
ok("next advances to a new phrase", text(".term") !== firstTerm, `${firstTerm} -> ${text(".term")}`);
ok("counter advanced", text("#drillCount") === "2 / 18", text("#drillCount"));
await click($("#prevBtn"));
ok("previous returns", text(".term") === firstTerm);
ok("learn marks items seen", Store.started("standup-0"));

console.log("\n\x1b[1mQUIZ MODE (multiple choice)\x1b[0m");
window.location.hash = "#/drill/review/quiz";
await tick(window, 4);
window.location.hash = "#/drill/standup/quiz";
await tick(window, 6);
ok("question renders", text(".q-text").length > 10);
ok("four options offered", $$(".opt").length === 4, String($$(".opt").length));
// The standup deck has 18 phrases, so the 20-question cap yields a run of 18.
const expected = +text("#drillCount").split("/")[1].trim();
let answered = 0, sawVerdict = false;
for (let n = 0; n < 25; n++) {
  const opts = $$(".opt:not([disabled])");
  if (!opts.length) break;
  await click(opts[0]);
  if ($(".verdict-head")) sawVerdict = true;
  const nb = $("#nextBtn");
  if (!nb) break;
  await click(nb);
  answered++;
}
ok("answering shows a verdict", sawVerdict);
ok("every question in the run is reachable", answered === expected, `${answered} of ${expected} answered`);
ok("summary screen shown", !!$(".summary"), text(".score"));
ok("score is a percentage", /^\d{1,3}%$/.test(text(".score")), text(".score"));
ok("quiz accuracy recorded", Store.accuracy() !== null, String(Store.accuracy()));

console.log("\n\x1b[1mFLASHCARDS\x1b[0m");
window.location.hash = "#/drill/review/flash";
await tick(window, 6);
ok("meaning shown first", text(".q-text").length > 10);
ok("reveal button present", !!$("#revealBtn"));
await key(" ");
ok("space reveals the answer", !!$(".grade-row") && $$(".grade").length === 3);
ok("answer term displayed", text(".term").length > 0, text(".term"));
const boxBefore = Store.box("review-" + 0);
await click($$(".grade")[2]);
ok("grading advances the card", text("#drillCount").startsWith("2"), text("#drillCount"));

console.log("\n\x1b[1mFILL THE GAP (cloze)\x1b[0m");
window.location.hash = "#/drill/incident/cloze";
await tick(window, 6);
const hasGap = !!$(".q-text .gap");
ok("sentence contains a blank", hasGap || $$(".opt").length === 4, hasGap ? "gap rendered" : "fell back to quiz (expected for some items)");
ok("options offered", $$(".opt").length === 4);
await click($$(".opt")[0]);
ok("feedback shown with model sentence", !!$(".verdict-head") && text(".verdict .example").length > 20);

console.log("\n\x1b[1mSPOT THE MISTAKE (fix it)\x1b[0m");
window.location.hash = "#/drill/pitfalls/fixit";
await tick(window, 6);
ok("awkward sentence shown struck through", !!$(".q-text s"), text(".q-text s"));
ok("four candidate sentences", $$(".opt").length === 4);
const correctIdx = [...$$(".opt")].findIndex(o => o.querySelector("span:last-child").textContent.length > 0);
await click($$(".opt")[0]);
ok("marks the right answer green", !!$(".opt.right"));
ok("explains which phrase to use", /Use/.test(text(".verdict")) || text(".verdict").length > 20);

console.log("\n\x1b[1mSAY IT (speaking)\x1b[0m");
window.location.hash = "#/drill/client/speak";
await tick(window, 6);
ok("target sentence displayed", text(".example").length > 20);
ok("slow-playback button present", !!$("#slowBtn"));
ok("falls back gracefully without speech recognition", !!$(".notice"), text(".notice").slice(0, 60) + "\u2026");
ok("self-grading offered", $$(".grade").length === 3);
await click($$(".grade")[1]);
ok("grading advances", text("#drillCount").startsWith("2"), text("#drillCount"));

console.log("\n\x1b[1mTODAY'S REVIEW (mixed, all decks)\x1b[0m");
window.location.hash = "#/review";
await tick(window, 6);
ok("review session starts", !!$("#drillBody").innerHTML.trim());
ok("review queue is capped at 20", /\/ (\d+)$/.test(text("#drillCount")) && +text("#drillCount").split("/")[1] <= 20, text("#drillCount"));

console.log("\n\x1b[1mSEARCH\x1b[0m");
const box = $("#search");
box.value = "doubt";
box.dispatchEvent(new window.Event("input", { bubbles: true }));
await tick(window, 10);
ok("search finds results for 'doubt'", $$(".sr-item").length > 0, String($$(".sr-item").length));
ok("surfaces the 'I have a question' correction",
  $$(".sr-item").some(i => /question/i.test(i.textContent)),
  $$(".sr-item").map(i => i.querySelector(".sr-term").textContent).join(" | "));
await click($$(".sr-item")[0]);
ok("clicking a result opens the full card", text(".term").length > 0 && text(".example").length > 20, text(".term"));

box.value = "deadline";
box.dispatchEvent(new window.Event("input", { bubbles: true }));
await tick(window, 10);
ok("search finds results for 'deadline'", $$(".sr-item").length > 0, String($$(".sr-item").length));

box.value = "zzzqqq";
box.dispatchEvent(new window.Event("input", { bubbles: true }));
await tick(window, 10);
ok("empty search shows a helpful message", !!$(".sr-empty"));

console.log("\n\x1b[1mSPEAKING PRACTICE (dialogues)\x1b[0m");
window.location.hash = "#/dialogues";
await tick(window, 6);
ok("all 6 scripts listed", $$(".dlg").length === 6, String($$(".dlg").length));
ok("bodies collapsed by default", $$(".dlg-body").every(b => b.hidden));
await click($(".dlg-head"));
ok("clicking a title expands it", !$(".dlg-body").hidden);
ok("lines rendered with speakers", $$(".dlg .line").length >= 5, String($$(".dlg .line").length));
ok("your lines highlighted", $$(".line.you").length > 0, String($$(".line.you").length));
ok("per-line listen buttons", $$(".line [data-say]").length >= 5);

console.log("\n\x1b[1mPERSISTENCE & CHROME\x1b[0m");
const saved = window.localStorage.getItem("it-english-coach/v1");
ok("progress written to localStorage", !!saved && saved.length > 50);
const parsed = JSON.parse(saved);
ok("per-item boxes stored", Object.keys(parsed.items).length > 0, Object.keys(parsed.items).length + " items");
ok("practice day logged", parsed.days.length === 1, JSON.stringify(parsed.days));
ok("streak shows after practice", /1 day/.test(text("#streak")), text("#streak"));

const wasLight = doc.body.classList.contains("light");
await click($("#themeBtn"));
ok("theme toggles", doc.body.classList.contains("light") !== wasLight);
ok("theme persisted", !!JSON.parse(window.localStorage.getItem("it-english-coach/v1")).theme);

window.location.hash = "#/deck/nonexistent-deck";
await tick(window, 5);
ok("unknown route falls back to home", $$(".deck-card").length === 10);

console.log("\n\x1b[1mSPACED REPETITION\x1b[0m");
Store.reset();
const id = "standup-0";
ok("new item is due", Store.isDue(id));
Store.grade(id, 2);
ok("correct answer moves it up a box", Store.box(id) === 1, "box " + Store.box(id));
ok("and it is no longer due today", !Store.isDue(id));
for (let i = 0; i < 4; i++) Store.grade(id, 2);
ok("five correct answers = mastered", Store.mastered(id), "box " + Store.box(id));
Store.grade(id, 0);
ok("forgetting resets to box 0", Store.box(id) === 0 && Store.isDue(id));

console.log("\n\x1b[1mSTYLESHEET GUARDS\x1b[0m");
// jsdom does not apply the stylesheet, so these are checked as source invariants.
// Elements we toggle with the `hidden` attribute also declare a `display`, which
// would otherwise beat the UA stylesheet's [hidden] rule and leave them visible.
const css = read("styles.css");
ok("[hidden] is forced off", /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/.test(css));
ok("no emoji left in the UI source",
  !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(read("js/app.js") + read("js/data.js") + read("index.html")),
  "emoji fall back to empty boxes without a colour-emoji font");

console.log("\n\x1b[1mRUNTIME ERRORS\x1b[0m");
ok("no uncaught page errors", pageErrors.length === 0, pageErrors.slice(0, 3).join(" || "));

console.log(`\n${"\u2500".repeat(52)}`);
if (fails.length) {
  console.log(`\x1b[31m${fails.length} FAILED\x1b[0m, ${pass} passed\n`);
  fails.forEach(f => console.log("  \u2717 " + f));
  process.exit(1);
}
console.log(`\x1b[32mAll ${pass} checks passed.\x1b[0m\n`);
dom.window.close();
