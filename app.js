/* ============================================================
   PYTHON QUEST: ENDPOINT EDITION — game engine
   ============================================================ */

const STORAGE_KEY = "python-quest-save-v1";

const state = {
  xp: 0,
  completed: [],          // lesson ids
  currentLessonId: LESSONS[0].id,
  hintsShown: {},         // lessonId -> number of hints revealed
};

let pyodide = null;
let pyReady = false;

/* ---------------- persistence ---------------- */
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    xp: state.xp,
    completed: state.completed,
    currentLessonId: state.currentLessonId,
    updated: state.updated || 0,
  }));
}
function save() {
  state.updated = Date.now();   // mark local change time (for sync conflict resolution)
  persist();
  scheduleSync();
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.xp = data.xp || 0;
    state.completed = data.completed || [];
    state.currentLessonId = data.currentLessonId || LESSONS[0].id;
    state.updated = data.updated || 0;
  } catch (e) { /* ignore corrupt save */ }
}

/* ---------------- progression helpers ---------------- */
const LEVEL_SIZE = 150; // xp per level
function levelInfo() {
  const level = Math.floor(state.xp / LEVEL_SIZE) + 1;
  const into = state.xp % LEVEL_SIZE;
  return { level, into, pct: Math.round((into / LEVEL_SIZE) * 100) };
}
function lessonIndex(id) { return LESSONS.findIndex(l => l.id === id); }
function isCompleted(id) { return state.completed.includes(id); }
function isUnlocked(id) {
  const idx = lessonIndex(id);
  if (idx === 0) return true;
  return isCompleted(LESSONS[idx - 1].id); // previous lesson done
}
function worldComplete(worldId) {
  const lessons = LESSONS.filter(l => l.world === worldId);
  return lessons.length > 0 && lessons.every(l => isCompleted(l.id));
}

/* ---------------- Python runner (Pyodide) ---------------- */
async function initPython() {
  const status = document.getElementById("py-status");
  try {
    status.textContent = "Booting Python engine…";
    pyodide = await loadPyodide();
    pyReady = true;
    status.textContent = "🐍 Python ready";
    status.classList.add("ready");
    renderLesson(); // re-render to enable buttons
    // Load the seed fleet into the live portal
    const seed = await runUserCode("", "");
    if (seed.state) renderPortal(seed.state);
    setTimeout(() => status.classList.add("fade"), 1500);
  } catch (e) {
    status.textContent = "⚠️ Python failed to load (need internet / a web server)";
  }
}

function indent(src) {
  return src.split("\n").map(l => "    " + l).join("\n");
}

async function runUserCode(userCode, testCode) {
  if (!pyReady) return { passed: false, feedback: "Python is still loading…", output: "", state: null };

  // ENV_PYTHON (from env.js) builds the fresh simulated intune/graph/falcon
  // world at the top level, then user + test code run inside a try block.
  const program =
`${ENV_PYTHON}
import io, sys
_buf = io.StringIO()
_old = sys.stdout
sys.stdout = _buf
_passed = False
_feedback = ""
try:
${indent(userCode) || "    pass"}
${testCode ? indent(testCode) : "    pass"}
except Exception as _e:
    _feedback = "💥 Python error: " + str(_e)
finally:
    sys.stdout = _old
_output = _buf.getvalue()
_state_json = __state__()
`;

  const ns = pyodide.toPy({});   // fresh, isolated namespace per run
  try {
    await pyodide.runPythonAsync(program, { globals: ns });
  } catch (e) {
    ns.destroy();
    const msg = (e.message || "").trim().split("\n").slice(-3).join(" ");
    return { passed: false, feedback: "💥 Syntax error — check your code:\n" + msg, output: "", state: null };
  }
  let state = null;
  try { state = JSON.parse(ns.get("_state_json")); } catch (e) { state = null; }
  const result = {
    passed: !!ns.get("_passed"),
    feedback: ns.get("_feedback") || "",
    output: ns.get("_output") || "",
    state,
  };
  ns.destroy();
  return result;
}

/* ---------------- rendering: sidebar ---------------- */
function renderSidebar() {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";

  WORLDS.forEach(world => {
    const lessons = LESSONS.filter(l => l.world === world.id);
    const done = lessons.filter(l => isCompleted(l.id)).length;

    const wEl = document.createElement("div");
    wEl.className = "world";

    const header = document.createElement("div");
    header.className = "world-head";
    header.innerHTML = `
      <span class="world-emoji">${world.emoji}</span>
      <span class="world-name">${world.name}</span>
      <span class="world-count ${done === lessons.length ? "all" : ""}">${done}/${lessons.length}</span>
      ${worldComplete(world.id) ? '<span class="badge-dot" title="World complete!">🏅</span>' : ""}
    `;
    wEl.appendChild(header);

    lessons.forEach(l => {
      const unlocked = isUnlocked(l.id);
      const completed = isCompleted(l.id);
      const item = document.createElement("button");
      item.className = "lesson-item"
        + (l.id === state.currentLessonId ? " active" : "")
        + (unlocked ? "" : " locked")
        + (completed ? " done" : "");
      item.disabled = !unlocked;
      item.innerHTML = `
        <span class="tick">${completed ? "✅" : unlocked ? "▶" : "🔒"}</span>
        <span class="lesson-title">${l.title}</span>
        <span class="xp-chip">${l.xp}xp</span>
      `;
      item.onclick = () => { state.currentLessonId = l.id; save(); render(); };
      wEl.appendChild(item);
    });

    nav.appendChild(wEl);
  });
}

/* ---------------- rendering: header / HUD ---------------- */
function renderHUD() {
  const { level, pct, into } = levelInfo();
  document.getElementById("level-num").textContent = level;
  document.getElementById("xp-total").textContent = state.xp;
  document.getElementById("xp-bar-fill").style.width = pct + "%";
  document.getElementById("xp-into").textContent = `${into} / ${LEVEL_SIZE}`;
  const doneCount = state.completed.length;
  document.getElementById("progress-count").textContent = `${doneCount} / ${LESSONS.length} quests`;
}

/* ---------------- rendering: lesson ---------------- */
let editor; // textarea element
function renderLesson() {
  const lesson = LESSONS.find(l => l.id === state.currentLessonId);
  const panel = document.getElementById("lesson");
  const world = WORLDS.find(w => w.id === lesson.world);
  const idx = lessonIndex(lesson.id);

  const shown = state.hintsShown[lesson.id] || 0;

  panel.innerHTML = `
    <div class="lesson-crumbs">${world.emoji} ${world.name} · Quest ${idx + 1} of ${LESSONS.length}</div>
    <h1 class="lesson-h1">${lesson.title} <span class="lesson-xp">+${lesson.xp} XP</span></h1>
    <div class="story">${lesson.story}</div>
    <div class="concept">${lesson.concept}</div>
    ${richSections(lesson)}
    <div class="task"><b>🎯 Your mission:</b> ${lesson.task}</div>

    <div class="editor-wrap">
      <div class="editor-bar">
        <span>main.py</span>
        <button id="reset-btn" class="mini-btn" title="Reset to starter code">↺ reset</button>
      </div>
      <textarea id="editor" spellcheck="false"></textarea>
    </div>

    <div class="btn-row">
      <button id="run-btn" class="btn run" ${pyReady ? "" : "disabled"}>▶ Run</button>
      <button id="check-btn" class="btn check" ${pyReady ? "" : "disabled"}>✓ Check answer</button>
      <button id="hint-btn" class="btn hint">💡 Hint</button>
      <button id="solution-btn" class="btn ghost">👀 Show solution</button>
    </div>

    <div id="hints" class="hints"></div>
    <pre id="console" class="console"></pre>
    <div id="feedback" class="feedback"></div>

    <div class="portal">
      <div class="portal-head">🖥️ Live Intune Portal <span class="portal-sub">— updates every time you run code</span></div>
      <div id="portal-body" class="portal-body"><div class="portal-empty">Run your code to load the fleet…</div></div>
    </div>

    <div class="lesson-foot">
      <button id="prev-btn" class="btn ghost" ${idx === 0 ? "disabled" : ""}>← Previous</button>
      <button id="next-btn" class="btn ghost" ${idx === LESSONS.length - 1 ? "disabled" : ""}>Next →</button>
    </div>
  `;

  editor = document.getElementById("editor");
  editor.value = loadDraft(lesson.id) ?? lesson.starter;
  autoResize(editor);

  // Tab inserts 4 spaces; auto-save draft
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = editor.selectionStart, en = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(en);
      editor.selectionStart = editor.selectionEnd = s + 4;
    }
  });
  editor.addEventListener("input", () => { autoResize(editor); saveDraft(lesson.id, editor.value); });

  document.getElementById("reset-btn").onclick = () => {
    editor.value = lesson.starter; saveDraft(lesson.id, editor.value); autoResize(editor);
  };
  document.getElementById("run-btn").onclick = () => doRun(lesson, false);
  document.getElementById("check-btn").onclick = () => doRun(lesson, true);
  document.getElementById("hint-btn").onclick = () => revealHint(lesson);
  document.getElementById("solution-btn").onclick = () => showSolution(lesson);
  document.getElementById("prev-btn").onclick = () => { if (idx > 0) { state.currentLessonId = LESSONS[idx-1].id; save(); render(); } };
  document.getElementById("next-btn").onclick = () => { if (idx < LESSONS.length-1 && isUnlocked(LESSONS[idx+1].id)) { state.currentLessonId = LESSONS[idx+1].id; save(); render(); } else if (idx < LESSONS.length-1) { toast("Finish this quest to unlock the next one! 🔒"); } };

  renderHints(lesson);
  if (lastState) renderPortal(lastState);  // keep the portal visible across lessons
}

function autoResize(ta) {
  ta.style.height = "auto";
  ta.style.height = Math.max(160, ta.scrollHeight + 4) + "px";
}

/* drafts so code survives navigation */
function draftKey(id) { return "pq-draft-" + id; }
function saveDraft(id, val) { localStorage.setItem(draftKey(id), val); }
function loadDraft(id) { return localStorage.getItem(draftKey(id)); }

/* ---------------- run / check ---------------- */
async function doRun(lesson, isCheck) {
  const consoleEl = document.getElementById("console");
  const feedbackEl = document.getElementById("feedback");
  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";
  consoleEl.textContent = "⏳ running…";

  const res = await runUserCode(editor.value, isCheck ? lesson.check : "");
  consoleEl.textContent = res.output ? res.output : "(no output)";
  if (res.state) renderPortal(res.state);

  if (!isCheck) {
    if (res.feedback && res.feedback.startsWith("💥")) {
      feedbackEl.textContent = res.feedback;
      feedbackEl.classList.add("bad");
    }
    return;
  }

  if (res.passed) {
    feedbackEl.textContent = "✅ " + res.feedback;
    feedbackEl.classList.add("good");
    completeLesson(lesson);
  } else {
    feedbackEl.textContent = res.feedback || "Not quite yet — tweak and try again.";
    feedbackEl.classList.add("bad");
  }
}

function completeLesson(lesson) {
  if (isCompleted(lesson.id)) {
    toast("Already cleared — nice refresher! ✨");
    return;
  }
  state.completed.push(lesson.id);
  state.xp += lesson.xp;
  save();
  confetti();

  const wasWorldDone = worldComplete(lesson.world);
  renderSidebar();
  renderHUD();

  if (wasWorldDone) {
    const w = WORLDS.find(x => x.id === lesson.world);
    toast(`🏅 World complete: ${w.name}! Badge earned.`);
  } else {
    toast(`+${lesson.xp} XP! Quest cleared 🎉`);
  }

  // auto-advance hint
  const idx = lessonIndex(lesson.id);
  if (idx < LESSONS.length - 1) {
    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) { nextBtn.classList.add("pulse"); nextBtn.disabled = false; }
  } else {
    setTimeout(() => toast("🏆 You finished Python Quest! Go ace that interview."), 1200);
  }
}

/* ---------------- hints & solution ---------------- */
function revealHint(lesson) {
  const shown = state.hintsShown[lesson.id] || 0;
  if (shown >= lesson.hints.length) { toast("That's all the hints — try the solution button 👀"); return; }
  state.hintsShown[lesson.id] = shown + 1;
  renderHints(lesson);
}
function renderHints(lesson) {
  const el = document.getElementById("hints");
  if (!el) return;
  const shown = state.hintsShown[lesson.id] || 0;
  el.innerHTML = "";
  for (let i = 0; i < shown; i++) {
    const h = document.createElement("div");
    h.className = "hint-line";
    h.innerHTML = `<b>Hint ${i + 1}:</b> <code>${escapeHtml(lesson.hints[i])}</code>`;
    el.appendChild(h);
  }
}
function showSolution(lesson) {
  const el = document.getElementById("hints");
  const box = document.createElement("div");
  box.className = "solution-box";
  box.innerHTML = `<div class="sol-head">✅ One working solution (type it yourself to learn it!)</div><pre>${escapeHtml(lesson.solution)}</pre>
    <button id="use-sol" class="mini-btn">Load into editor</button>`;
  el.appendChild(box);
  document.getElementById("use-sol").onclick = () => {
    editor.value = lesson.solution; saveDraft(lesson.id, editor.value); autoResize(editor);
    toast("Loaded — now run it and read each line 📖");
  };
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- rich lesson sections (professional depth) ---------------- */
function section(title, cls, inner) {
  return inner ? `<div class="sec sec-${cls}"><div class="sec-h">${title}</div><div class="sec-b">${inner}</div></div>` : "";
}
function richSections(l) {
  let h = "";
  if (l.deepDive) h += section("📘 Deep dive", "deepdive", l.deepDive);
  if (l.examples && l.examples.length) h += section("🔧 Worked examples", "examples", l.examples.map(e => `<div class="ex">${e}</div>`).join(""));
  if (l.pitfalls && l.pitfalls.length) h += section("⚠️ Common pitfalls", "pitfalls", "<ul>" + l.pitfalls.map(p => `<li>${p}</li>`).join("") + "</ul>");
  if (l.why) h += section("🎯 Why it matters / interview", "why", l.why);
  if (l.keyPoints && l.keyPoints.length) h += section("🧠 Key takeaways", "key", "<ul>" + l.keyPoints.map(k => `<li>${k}</li>`).join("") + "</ul>");
  if (l.references && l.references.length) h += section("🔗 Go deeper", "refs", "<ul>" + l.references.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a></li>`).join("") + "</ul>");
  return h;
}

/* ---------------- live Intune portal ---------------- */
let lastState = null;   // previous render's state (for change-glow diffing)

function renderPortal(state) {
  const body = document.getElementById("portal-body");
  if (!body || !state) return;

  const prev = lastState;
  const prevById = {};
  if (prev && prev.devices) prev.devices.forEach(d => { prevById[d.id] = d; });

  const devs = state.devices || [];
  let html = `<div class="dev-grid">
    <div class="dev-head-row">
      <span>Device</span><span>OS</span><span>Compliance</span><span>Owner</span><span>Last sync</span><span>Tags</span>
    </div>`;

  devs.forEach(d => {
    const p = prevById[d.id];
    const changed = !p || JSON.stringify(p) !== JSON.stringify(d);
    const prevTags = p ? (p.tags || []) : [];
    const cat = d.category ? `<span class="chip chip-cat">${escapeHtml(d.category)}</span>` : "";
    const chips = (d.tags && d.tags.length)
      ? d.tags.map(t => `<span class="chip ${prevTags.includes(t) ? "" : "chip-new"}">${escapeHtml(t)}</span>`).join("")
      : `<span class="chip-empty">—</span>`;
    html += `<div class="dev-row ${changed ? "changed" : ""}">
      <span class="dev-name">${escapeHtml(d.name)}<i>${escapeHtml(d.id)}</i></span>
      <span class="dev-os">${escapeHtml(d.os)} <small>${escapeHtml(d.osVersion)}</small></span>
      <span class="dev-comp ${d.compliant ? "ok" : "bad"}">${d.compliant ? "compliant" : "non-compliant"}</span>
      <span class="dev-owner">${escapeHtml(d.owner)}</span>
      <span class="dev-seen">${escapeHtml(d.lastSeen)}</span>
      <span class="dev-tags">${cat}${chips}</span>
    </div>`;
  });
  html += `</div>`;

  const dets = state.detections || [];
  if (dets.length) {
    html += `<div class="det-head">🛡️ CrowdStrike detections</div><div class="det-grid">`;
    dets.forEach(x => {
      const prevDet = prev && prev.detections ? prev.detections.find(z => z.id === x.id) : null;
      const chg = !prevDet || prevDet.status !== x.status;
      html += `<div class="det-row ${chg ? "changed" : ""}">
        <span class="sev sev-${escapeHtml(x.severity)}">${escapeHtml(x.severity)}</span>
        <span class="det-host">${escapeHtml(x.hostname)}</span>
        <span class="det-tactic">${escapeHtml(x.tactic)}</span>
        <span class="det-status st-${escapeHtml(x.status)}">${escapeHtml(x.status)}</span>
      </div>`;
    });
    html += `</div>`;
  }

  if (typeof state.graphCalls === "number") {
    html += `<div class="portal-foot">Graph API calls: <b>${state.graphCalls}</b> · Authenticated: <b>${state.authed ? "yes 🔑" : "no"}</b></div>`;
  }

  body.innerHTML = html;
  lastState = state;   // becomes "prev" for the next render
}

/* ---------------- toast + confetti ---------------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function confetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#7c5cff", "#38e8c6", "#ffcf5c", "#ff5c8a", "#5cc8ff"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    r: 4 + Math.random() * 6,
    c: colors[(Math.random() * colors.length) | 0],
    vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
  }));
  let frames = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    frames++;
    if (frames < 140) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

/* ---------------- reset progress ---------------- */
function resetProgress() {
  if (!confirm("Reset ALL progress, XP and badges? This can't be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  LESSONS.forEach(l => localStorage.removeItem(draftKey(l.id)));
  state.xp = 0; state.completed = []; state.hintsShown = {};
  state.currentLessonId = LESSONS[0].id;
  render();
  toast("Fresh start! Good luck 🍀");
}

/* ================= CLOUD SYNC (one-time code, no login) =================
   Progress is stored in a free cloud "blob" identified by a sync code.
   One code covers BOTH quests (shared origin). All calls are fail-safe:
   any network error silently falls back to localStorage. */
const APP_KEY = "python-quest";
const SB_URL = "https://ymzokfvbfmetzsygmxsh.supabase.co/rest/v1/progress";
const SB_KEY = "sb_publishable_FlOsN7qt1YpKbnvDeaxGJg_Tx73AYr3";
const SB_HEADERS = { "apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY, "Content-Type": "application/json" };
const SYNC_ID_KEY = "quest-sync-id";
let syncTimer = null;

function fetchT(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 12000);
  return fetch(url, Object.assign({ signal: ctrl.signal }, opts || {})).finally(() => clearTimeout(t));
}
function setSyncMsg(text, isError) {
  const el = document.getElementById("sync-msg");
  if (el) { el.textContent = text || ""; el.style.color = isError ? "var(--bad)" : "var(--good)"; }
}

function getSyncId() { return localStorage.getItem(SYNC_ID_KEY) || ""; }
function setSyncId(id) { if (id) localStorage.setItem(SYNC_ID_KEY, id); }
function clearSyncId() { localStorage.removeItem(SYNC_ID_KEY); }
function mySection() { return { xp: state.xp, completed: state.completed, current: state.currentLessonId, updated: state.updated || Date.now() }; }

// Merge a remote section into local WITHOUT losing progress (union of completed).
function mergeSection(sec) {
  if (!sec) return false;
  const before = state.completed.length;
  const union = Array.from(new Set([...(state.completed || []), ...((sec.completed) || [])]));
  const changed = union.length !== before || (Number(sec.xp) || 0) > state.xp;
  state.completed = union;
  state.xp = Math.max(state.xp, Number(sec.xp) || 0);
  return changed;
}
function newSyncCode() {
  try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
}
async function sbGet(code) {
  const r = await fetchT(SB_URL + "?code=eq." + encodeURIComponent(code) + "&select=data", { headers: SB_HEADERS });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const rows = await r.json();
  if (!rows || !rows[0]) return null;          // no such code exists
  return rows[0].data || {};
}
async function sbPut(code, data) {
  const r = await fetchT(SB_URL, { method: "POST", headers: Object.assign({ "Prefer": "resolution=merge-duplicates" }, SB_HEADERS), body: JSON.stringify({ code: code, data: data, updated: new Date().toISOString() }) });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
// Short, easy-to-type 4-digit code (1000–9999). We check Supabase that it's
// free before handing it out so two people can never collide on the same code.
function rand4() { return String(Math.floor(1000 + Math.random() * 9000)); }
async function freeSyncCode() {
  for (let i = 0; i < 25; i++) {
    const c = rand4();
    const existing = await sbGet(c);               // throws on network error -> caller handles
    if (!existing || Object.keys(existing).length === 0) return c;
  }
  return newSyncCode();                             // fallback: unique UUID if all 4-digit tries were taken
}

async function pullSync() {
  const id = getSyncId(); if (!id) return;
  try {
    const data = await sbGet(id) || {};
    if (mergeSection(data[APP_KEY])) { persist(); renderSidebar(); renderHUD(); renderLesson(); toast("☁ Synced from your other device"); }
    updateSyncUI();
  } catch (e) { /* offline — ignore */ }
}
function scheduleSync() { if (!getSyncId()) return; clearTimeout(syncTimer); syncTimer = setTimeout(pushSync, 1200); }
async function pushSync() {
  const id = getSyncId(); if (!id) return;
  try {
    let data = {};
    try { data = await sbGet(id) || {}; } catch (e) {}
    mergeSection(data[APP_KEY]);      // fold any remote progress into local FIRST so a push can never shrink it
    data[APP_KEY] = mySection();      // then store the union
    await sbPut(id, data);
    updateSyncUI("ok");
  } catch (e) { updateSyncUI("err"); }
}
async function enableSync() {
  setSyncMsg("Enabling cloud sync…");
  try {
    const code = await freeSyncCode();
    const data = {}; data[APP_KEY] = mySection();
    await sbPut(code, data);
    setSyncId(code); updateSyncUI();
    setSyncMsg("✅ Cloud sync enabled — copy your code below and enter it on your other devices.");
    toast("☁ Cloud sync enabled");
  } catch (e) {
    setSyncMsg("Couldn't enable sync: " + ((e && e.message) || "network error") + ". Try again, or use Manual backup below.", true);
  }
}
async function connectSync() {
  const input = document.getElementById("sync-code-input");
  const id = (input ? input.value : "").trim();
  if (!id) { setSyncMsg("Paste a sync code first.", true); return; }
  setSyncMsg("Connecting…");
  try {
    const data = await sbGet(id);
    if (!data) { setSyncMsg("No data found for code \"" + id + "\". Check the digits, and make sure sync is enabled on the device that has your progress.", true); return; }
    const sec = data[APP_KEY];
    setSyncId(id);
    mergeSection(sec);
    if (sec && sec.current) state.currentLessonId = sec.current;   // jump to where you left off
    persist(); await pushSync();
    renderSidebar(); renderHUD(); renderLesson(); updateSyncUI();
    if (!sec || !(sec.completed && sec.completed.length)) {
      setSyncMsg("Connected to \"" + id + "\", but it has no saved progress for this quest yet. Enable sync on the device that has your progress, then use the code it shows.", true);
    } else {
      setSyncMsg("✅ Connected — restored " + state.completed.length + " completed lesson(s), " + state.xp + " XP.");
      toast("☁ Connected & synced");
    }
  } catch (e) { setSyncMsg("Couldn't connect: " + ((e && e.message) || "network error") + ".", true); }
}
function disconnectSync() { clearSyncId(); updateSyncUI(); setSyncMsg("Cloud sync turned off (progress stays on this device)."); }

function updateSyncUI(flag) {
  const on = !!getSyncId();
  const status = document.getElementById("sync-status");
  const codeWrap = document.getElementById("sync-code-wrap");
  const codeOut = document.getElementById("sync-code-out");
  const enableBtn = document.getElementById("sync-enable");
  const disconnectBtn = document.getElementById("sync-disconnect");
  if (!status) return;
  if (on) {
    status.innerHTML = "Cloud sync: <b style='color:var(--good)'>ON</b>" + (flag === "err" ? " <span style='color:var(--warn)'>(will retry — offline)</span>" : "");
    if (codeOut) codeOut.value = getSyncId();
    if (codeWrap) codeWrap.style.display = "";
    if (enableBtn) enableBtn.style.display = "none";
    if (disconnectBtn) disconnectBtn.style.display = "";
  } else {
    status.innerHTML = "Cloud sync: <b style='color:var(--muted)'>OFF</b>";
    if (codeWrap) codeWrap.style.display = "none";
    if (enableBtn) enableBtn.style.display = "";
    if (disconnectBtn) disconnectBtn.style.display = "none";
  }
}

/* ---------------- manual backup (fallback) ---------------- */
function exportCode() {
  const data = { v: 1, app: APP_KEY, xp: state.xp, completed: state.completed, current: state.currentLessonId };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}
function openBackup() {
  const ta = document.getElementById("backup-code");
  if (ta) ta.value = exportCode();
  const msg = document.getElementById("backup-msg"); if (msg) msg.textContent = "";
  updateSyncUI();
  document.getElementById("backup-modal").classList.add("show");
}
function closeBackup() { document.getElementById("backup-modal").classList.remove("show"); }
function restoreFromCode() {
  const ta = document.getElementById("backup-code");
  const msg = document.getElementById("backup-msg");
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob((ta.value || "").trim()))));
    if (!data || !Array.isArray(data.completed)) throw new Error("invalid");
    state.xp = Number(data.xp) || 0;
    state.completed = data.completed;
    state.currentLessonId = data.current || LESSONS[0].id;
    save();
    closeBackup();
    render();
    toast("✅ Progress restored!");
  } catch (e) {
    if (msg) msg.textContent = "That code didn't look right — paste the full backup code and try Restore again.";
  }
}
function downloadBackup() {
  const blob = new Blob([exportCode()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "python-quest-progress.txt";
  document.body.appendChild(a); a.click(); a.remove();
  toast("Downloaded your backup 📄");
}
function copyText(val) {
  const done = () => toast("Copied! 📋");
  if (navigator.clipboard) navigator.clipboard.writeText(val).then(done).catch(done);
  else done();
}
function copyBackup() { copyText(document.getElementById("backup-code").value); }
function copySyncCode() { copyText(getSyncId()); }

/* ---------------- master render ---------------- */
function render() {
  renderSidebar();
  renderHUD();
  renderLesson();
}

/* ---------------- durable storage (automatic) ---------------- */
// Ask the browser to make this origin's storage persistent so it isn't
// auto-evicted (storage pressure, Safari ITP, etc.). No user action needed.
async function requestPersistence() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      const already = await navigator.storage.persisted();
      if (!already) await navigator.storage.persist();
    }
  } catch (e) { /* not supported — localStorage still used */ }
}

/* ---------------- python playground (free sandbox, not graded) ---------------- */
const PLAY_EXAMPLES = {
  list: `# Every device in the simulated Intune tenant\nfor d in intune.devices:\n    print(d["name"], "|", d["os"], d["osVersion"], "| compliant:", d["compliant"])`,
  tag: `# Apply an OS tag to each device and show the result\nfor d in intune.devices:\n    tag = f"{d['os']}-{d['osVersion'].split('.')[0]}"\n    d["tags"].append(tag)\n    print(d["name"], "->", tag)`,
  graph: `# Call the mock Microsoft Graph API (authenticate, then GET devices)\ngraph.authenticate("client-id", "secret", "tenant-id")\nresp = graph.get("/deviceManagement/managedDevices")\nprint("status:", resp.status_code)\nfor dev in resp.json()["value"]:\n    print(dev["deviceName"], "-", dev["operatingSystem"])`,
  falcon: `# CrowdStrike Falcon detections in the environment\nfor det in falcon.detections:\n    print(det["severity"].upper(), "-", det["hostname"], "-", det["tactic"])`,
};
const PLAY_STARTER = `# Live sandbox — real Python against a simulated endpoint environment.\n# Objects available: intune, graph, falcon, aws, k8s\n# Example: list the devices in the tenant.\n\nfor d in intune.devices:\n    print(d["name"], "-", d["os"])\n`;

function openPlay() {
  const ed = document.getElementById("play-ed");
  if (!ed.value) ed.value = PLAY_STARTER;
  document.getElementById("play-modal").classList.add("show");
}
function closePlay() { document.getElementById("play-modal").classList.remove("show"); }
async function runPlayground() {
  const out = document.getElementById("play-out");
  out.classList.remove("err");
  if (!pyReady) { out.textContent = "🐍 Python is still loading — try again in a moment."; return; }
  const code = document.getElementById("play-ed").value;
  out.textContent = "Running…";
  const res = await runUserCode(code, "");
  let text = res.output || "";
  if (res.feedback) { text += (text ? "\n" : "") + res.feedback; out.classList.add("err"); }
  out.textContent = text.trim() || "(ran successfully — no output. Add print(...) to see results.)";
}

/* ---------------- boot ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  load();
  render();
  requestPersistence();
  pullSync();            // auto-pull from cloud if a sync code is set
  // Flush the latest state when leaving/hiding the tab (extra safety).
  window.addEventListener("beforeunload", () => { persist(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { persist(); } else { pullSync(); } });
  document.getElementById("reset-progress").onclick = resetProgress;
  const wire = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
  wire("backup-btn", openBackup);
  wire("close-modal", closeBackup);
  wire("copy-code", copyBackup);
  wire("download-code", downloadBackup);
  wire("restore-code", restoreFromCode);
  wire("sync-enable", enableSync);
  wire("sync-connect", connectSync);
  wire("sync-disconnect", disconnectSync);
  wire("sync-copy", copySyncCode);
  // playground
  wire("play-btn", openPlay);
  wire("play-close", closePlay);
  wire("play-run", runPlayground);
  wire("play-reset", () => { document.getElementById("play-ed").value = ""; document.getElementById("play-out").textContent = "Press ▶ Run to see output."; document.getElementById("play-out").classList.remove("err"); });
  document.querySelectorAll(".play-ex").forEach(b => b.onclick = () => { document.getElementById("play-ed").value = PLAY_EXAMPLES[b.dataset.ex] || ""; });
  initPython();
});
