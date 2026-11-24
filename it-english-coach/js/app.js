/* ------------------------------------------------------------------
   IT English Coach — views, router and drill engine
   ------------------------------------------------------------------ */

/* ------------------------------- helpers -------------------------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $("#view");

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/** Clone a <template> and hydrate any [data-icon] placeholders inside it. */
function tpl(id) {
  const frag = $(`#tpl-${id}`).content.cloneNode(true);
  frag.querySelectorAll("[data-icon]").forEach(el =>
    el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon, +(el.dataset.iconSize || 15))));
  return frag;
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);

/* ------------------------------ flat index ------------------------------- */
const ITEMS = [];
DECKS.forEach(d => d.items.forEach((it, i) => {
  ITEMS.push({ ...it, id: `${d.id}-${i}`, deck: d.id, deckName: d.name });
}));
const byId = new Map(ITEMS.map(i => [i.id, i]));
const deckById = new Map(DECKS.map(d => [d.id, d]));

/* --------------------------------- icons --------------------------------
   Inline SVG rather than emoji: emoji fall back to empty boxes on machines
   without a colour-emoji font, which is common on Linux desktops.
   ------------------------------------------------------------------------ */
const ICONS = {
  bubble:   '<path d="M4 5.5h16V15H10l-6 4.5z"/>',
  exchange: '<path d="M3.5 8.5h13.5"/><path d="M13.5 5l3.5 3.5-3.5 3.5"/><path d="M20.5 15.5H7"/><path d="M10.5 12L7 15.5l3.5 3.5"/>',
  search:   '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2L21 21"/>',
  alert:    '<path d="M12 3.5l10.5 17H1.5z"/><path d="M12 9.5v4.6"/><path d="M12 17.3h.01"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10.5h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  users:    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.7 2.9-5.6 6.5-5.6s6.5 1.9 6.5 5.6"/><circle cx="17.6" cy="9.6" r="2.4"/><path d="M17.2 14.3c2.6.2 4.3 2 4.3 5.2"/>',
  layers:   '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  mail:     '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3.2 7.4L12 13.8l8.8-6.4"/>',
  star:     '<path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  pencil:   '<path d="M4 17.6L16.4 5.2a2.6 2.6 0 0 1 3.7 3.7L7.7 21.3H4z"/><path d="M13.2 8.4l3.7 3.7"/>',
  speaker:  '<path d="M11.5 4.5L6.8 8.8H3v6.4h3.8l4.7 4.3z"/><path d="M15.2 9.3a3.9 3.9 0 0 1 0 5.4"/><path d="M18 6.4a7.9 7.9 0 0 1 0 11.2"/>',
  sun:      '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
  moon:     '<path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z"/>',
  mic:      '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3.5"/>',
  flame:    '<path d="M13 2.5c.5 3 3.5 4.5 3.5 8.5a4.5 4.5 0 0 1-9 0c0-1.8.8-3 .8-3s.4 1.6 1.7 1.6c0-3.4 2-5.1 3-7.1z"/>',
  chevron:  '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
  check:    '<path d="M4.5 12.8l4.8 4.7L19.5 6.5"/>',
  cross:    '<path d="M6.2 6.2l11.6 11.6"/><path d="M17.8 6.2L6.2 17.8"/>',
  arrowL:   '<path d="M19 12H5.5"/><path d="M11.5 18L5 12l6.5-6"/>',
  arrowR:   '<path d="M5 12h13.5"/><path d="M12.5 6L19 12l-6.5 6"/>'
};
const icon = (name, size = 22) =>
  `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor"
        stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ""}</svg>`;

/* ------------------------------- speak button ---------------------------- */
function sayBtn(text, cls = "say") {
  return `<button class="${cls}" data-say="${esc(text)}" title="Listen" aria-label="Listen">${icon("speaker", cls.includes("sm") ? 14 : 16)}</button>`;
}

view.addEventListener("click", e => {
  const b = e.target.closest("[data-say]");
  if (!b) return;
  $$(".say.playing").forEach(x => x.classList.remove("playing"));
  Speech.speak(b.dataset.say, {
    onStart: () => b.classList.add("playing"),
    onEnd:   () => b.classList.remove("playing")
  });
});

/* ================================ ROUTER ================================= */
function route() {
  Speech.stop();
  Speech.stopListening();
  const h = location.hash.replace(/^#\/?/, "");
  const [a, b, c] = h.split("/");

  if (a === "deck" && deckById.has(b))      renderDeck(b);
  else if (a === "drill" && b)              startDrill(b, c);
  else if (a === "dialogues")               renderDialogues();
  else if (a === "review")                  startDrill("__all", "review");
  else                                      renderHome();

  paintStreak();
  window.scrollTo({ top: 0, behavior: "instant" });
}
addEventListener("hashchange", route);

const go = path => { location.hash = "#/" + path; };

view.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) go(g.dataset.go);
});

/* ================================= HOME ================================== */
function dueItems() {
  return ITEMS.filter(i => Store.isDue(i.id) && !Store.mastered(i.id));
}

function renderHome() {
  view.replaceChildren(tpl("home"));
  view.firstElementChild.classList.add("fade-in");

  $("[data-count=phrases]").textContent = ITEMS.length;

  const mastered = ITEMS.filter(i => Store.mastered(i.id)).length;
  const started  = ITEMS.filter(i => Store.started(i.id)).length;
  $("#statMastered").textContent = mastered;
  $("#statLearning").textContent = Math.max(0, started - mastered);
  $("#statUnseen").textContent   = ITEMS.length - started;
  const acc = Store.accuracy();
  $("#statAccuracy").textContent = acc === null ? "\u2013" : acc + "%";

  const due = dueItems().length;
  $("#dueCount").textContent = due ? `${Math.min(due, 20)} phrases waiting` : "all caught up \u2014 free practice";

  const grid = $("#deckGrid");
  grid.innerHTML = DECKS.map(d => {
    const ids = d.items.map((_, i) => `${d.id}-${i}`);
    const m = ids.filter(id => Store.mastered(id)).length;
    const pct = Math.round((m / ids.length) * 100);
    return `
      <button class="deck-card" data-deck="${d.id}">
        <div class="dc-top"><span class="dc-icon">${icon(d.icon, 20)}</span><h3>${esc(d.name)}</h3></div>
        <p>${esc(d.blurb)}</p>
        <div class="meter"><i style="width:${pct}%"></i></div>
        <div class="dc-foot"><span>${ids.length} phrases</span><span>${m} mastered</span></div>
      </button>`;
  }).join("");

  grid.onclick = e => {
    const c = e.target.closest("[data-deck]");
    if (c) go("deck/" + c.dataset.deck);
  };
}

/* ================================= DECK ================================== */
function renderDeck(id) {
  const d = deckById.get(id);
  view.replaceChildren(tpl("deck"));
  view.firstElementChild.classList.add("fade-in");

  $("#deckIcon").innerHTML = icon(d.icon, 30);
  $("#deckName").textContent = d.name;
  $("#deckBlurb").textContent = d.blurb;

  const ids = d.items.map((_, i) => `${id}-${i}`);
  const m = ids.filter(x => Store.mastered(x)).length;
  const s = ids.filter(x => Store.started(x)).length;
  $("#deckProgress").innerHTML =
    `${ids.length} phrases &middot; ${s} studied &middot; <b style="color:var(--good)">${m} mastered</b>`;

  const fixable = d.items.filter(i => i.avoid).length;
  $$(".mode").forEach(btn => {
    if (btn.dataset.mode === "fixit" && fixable < 3) {
      btn.disabled = true;
      btn.style.opacity = .45;
      btn.querySelector("span").textContent = "Not enough examples in this deck.";
      return;
    }
    btn.onclick = () => go(`drill/${id}/${btn.dataset.mode}`);
  });
}

/* ============================= DRILL ENGINE ============================== */
let D = null;   // active drill session

function startDrill(deckId, mode) {
  const all = deckId === "__all" ? ITEMS : ITEMS.filter(i => i.deck === deckId);
  let queue;

  if (mode === "review") {
    const due = all.filter(i => Store.isDue(i.id));
    const pool = due.length >= 8 ? due : all;
    queue = sample(pool, Math.min(20, pool.length));
  } else if (mode === "fixit") {
    queue = shuffle(all.filter(i => i.avoid));
  } else if (mode === "learn") {
    queue = all.slice();                       // keep authored order
  } else {
    queue = shuffle(all).slice(0, 20);
  }

  if (!queue.length) { go("home"); return; }

  D = { mode, deckId, queue, i: 0, right: 0, wrong: 0, missed: [], pool: all };

  view.replaceChildren(tpl("drill"));
  view.firstElementChild.classList.add("fade-in");
  $("#drillExit").onclick = () => go(deckId === "__all" ? "home" : "deck/" + deckId);
  step();
}

function step() {
  paintStreak();                    // the first graded answer starts today's streak
  const n = D.queue.length;
  $("#drillBar").style.width = `${(D.i / n) * 100}%`;
  $("#drillCount").textContent = D.i >= n ? "done" : `${D.i + 1} / ${n}`;

  if (D.i >= n) return renderSummary();

  const item = D.queue[D.i];
  const mode = D.mode === "review" ? (Math.random() < 0.5 ? "flash" : "cloze") : D.mode;
  const body = $("#drillBody");
  body.innerHTML = "";
  body.classList.remove("fade-in"); void body.offsetWidth; body.classList.add("fade-in");

  ({ learn: viewLearn, flash: viewFlash, quiz: viewQuiz, cloze: viewCloze, fixit: viewFixit, speak: viewSpeak }[mode])(item, body);
}

function next() { D.i++; step(); }

function nextBtn(label = "Next") {
  return `<button class="btn primary wide" id="nextBtn">${label} <span class="btn-sub">press Enter</span></button>`;
}
function wireNext() {
  const b = $("#nextBtn");
  if (b) { b.onclick = next; b.focus({ preventScroll: true }); }
}

/* ------------------------------ mode: learn ----------------------------- */
function fullCard(it) {
  return `
    <div class="card">
      <div class="term-row">
        <span class="term">${esc(it.term)}</span>
        ${sayBtn(it.term)}
      </div>
      <div><div class="label">Means</div><div class="meaning">${esc(it.meaning)}</div></div>
      <div>
        <div class="label">Say it like this</div>
        <div class="row" style="align-items:flex-start">
          <div class="example" style="flex:1">${esc(it.example)}</div>
          ${sayBtn(it.example)}
        </div>
      </div>
      ${it.also ? `<div><div class="label">Also works</div><div class="chips">${it.also.map(a => `<span class="chip">${esc(a)}</span>`).join("")}</div></div>` : ""}
      ${it.avoid ? `<div class="block avoid"><div class="label">Avoid</div><s>${esc(it.avoid)}</s></div>` : ""}
      ${it.note ? `<div class="block note">${esc(it.note)}</div>` : ""}
    </div>`;
}

function viewLearn(it, body) {
  body.innerHTML = `
    <div class="stack">
      <div class="prompt">${esc(it.deckName)}</div>
      ${fullCard(it)}
      <div class="row">
        <button class="btn ghost inline" id="prevBtn" ${D.i === 0 ? "disabled style=opacity:.4" : ""}>${icon("arrowL", 16)}<span>Previous</span></button>
        <div class="spacer"></div>
        <button class="btn primary inline" id="nextBtn">${D.i === D.queue.length - 1
          ? "<span>Finish</span>"
          : `<span>Next</span>${icon("arrowR", 16)}`}</button>
      </div>
      <p class="hint">Read the example sentence out loud before you move on. Press <span class="kbd">P</span> to hear it.</p>
    </div>`;
  Store.markSeen(it.id);
  $("#prevBtn").onclick = () => { if (D.i > 0) { D.i--; step(); } };
  wireNext();
}

/* ---------------------------- mode: flashcards -------------------------- */
function viewFlash(it, body) {
  body.innerHTML = `
    <div class="stack">
      <div class="prompt">Which phrase means this?</div>
      <div class="card flip-card">
        <div class="q-text">${esc(it.meaning)}</div>
        <p class="hint">Say the phrase out loud, then reveal.</p>
        <button class="btn primary" id="revealBtn">Reveal <span class="btn-sub">space</span></button>
      </div>
    </div>`;

  $("#revealBtn").onclick = () => {
    body.innerHTML = `
      <div class="stack">
        <div class="prompt">Answer</div>
        <div class="card">
          <div class="term-row"><span class="term">${esc(it.term)}</span>${sayBtn(it.term)}</div>
          <div class="row" style="align-items:flex-start">
            <div class="example" style="flex:1">${esc(it.example)}</div>
            ${sayBtn(it.example)}
          </div>
          ${it.note ? `<div class="block note">${esc(it.note)}</div>` : ""}
        </div>
        <div class="prompt">How did that go?</div>
        <div class="grade-row">
          <button class="grade" data-g="0">No idea<small>show again today</small></button>
          <button class="grade" data-g="1">Shaky<small>show tomorrow</small></button>
          <button class="grade" data-g="2">Knew it<small>push it back</small></button>
        </div>
      </div>`;
    $$(".grade").forEach(g => g.onclick = () => {
      Store.grade(it.id, +g.dataset.g);
      if (+g.dataset.g === 0) { D.wrong++; D.missed.push(it); } else D.right++;
      next();
    });
  };
}

/* ------------------------------- mode: quiz ----------------------------- */
function distractors(it, key, n = 3) {
  const pool = D.pool.filter(x => x.id !== it.id && x[key] && x[key] !== it[key]);
  const near = pool.filter(x => x.deck === it.deck);
  const picks = sample(near.length >= n ? near : pool, n);
  return picks;
}

function askOptions(body, { prompt, question, options, correctIdx, after }) {
  body.innerHTML = `
    <div class="stack">
      <div class="prompt">${prompt}</div>
      <div class="card"><div class="q-text">${question}</div></div>
      <div class="options">
        ${options.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${i + 1}</span><span>${o}</span></button>`).join("")}
      </div>
      <div id="verdict"></div>
    </div>`;

  const opts = $$(".opt", body);
  opts.forEach(b => b.onclick = () => {
    const chosen = +b.dataset.i;
    const ok = chosen === correctIdx;
    opts.forEach((x, i) => {
      x.disabled = true;
      if (i === correctIdx) x.classList.add("right");
      else if (i === chosen) x.classList.add("wrong");
    });
    after(ok);
  });
}

function verdict(ok, it, extra = "") {
  $("#verdict").innerHTML = `
    <div class="card verdict">
      <div class="verdict-head ${ok ? "ok" : "no"}">${icon(ok ? "check" : "cross", 18)}<span>${ok ? "Correct" : "Not quite"}</span></div>
      <div class="row" style="align-items:flex-start">
        <div class="example" style="flex:1">${esc(it.example)}</div>
        ${sayBtn(it.example)}
      </div>
      ${extra}
      ${it.note ? `<div class="block note">${esc(it.note)}</div>` : ""}
      ${nextBtn(D.i === D.queue.length - 1 ? "See results" : "Next")}
    </div>`;
  wireNext();
}

function viewQuiz(it, body) {
  const opts = shuffle([it, ...distractors(it, "term")]);
  askOptions(body, {
    prompt: "Choose the phrase",
    question: esc(it.meaning),
    options: opts.map(o => `<b>${esc(o.term)}</b>`),
    correctIdx: opts.indexOf(it),
    after: ok => {
      Store.answered(it.id, ok);
      ok ? D.right++ : (D.wrong++, D.missed.push(it));
      verdict(ok, it, `<div><div class="label">Means</div>${esc(it.meaning)}</div>`);
    }
  });
}

/* ------------------------------ mode: cloze ----------------------------- */
function blankOut(sentence, term) {
  const i = sentence.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return null;
  return esc(sentence.slice(0, i)) + `<span class="gap">&nbsp;</span>` + esc(sentence.slice(i + term.length));
}

function viewCloze(it, body) {
  const gapped = blankOut(it.example, it.term);
  if (!gapped) return viewQuiz(it, body);          // term not literal in sentence

  const opts = shuffle([it, ...distractors(it, "term")]);
  askOptions(body, {
    prompt: "Complete the sentence",
    question: gapped,
    options: opts.map(o => `<b>${esc(o.term)}</b>`),
    correctIdx: opts.indexOf(it),
    after: ok => {
      Store.answered(it.id, ok);
      ok ? D.right++ : (D.wrong++, D.missed.push(it));
      verdict(ok, it, `<div><div class="label">${esc(it.term)}</div>${esc(it.meaning)}</div>`);
    }
  });
}

/* ------------------------------ mode: fix it ---------------------------- */
function viewFixit(it, body) {
  // Options: this item's natural sentence against three awkward ones from other items.
  const choices = shuffle([
    { text: it.example, ok: true },
    ...sample(D.pool.filter(x => x.id !== it.id && x.avoid), 3).map(x => ({ text: x.avoid, ok: false }))
  ]);

  askOptions(body, {
    prompt: "Which sentence sounds natural at work?",
    question: `Instead of &ldquo;<s style="color:var(--bad)">${esc(it.avoid)}</s>&rdquo; &mdash; what would a fluent colleague say?`,
    options: choices.map(c => esc(c.text)),
    correctIdx: choices.findIndex(c => c.ok),
    after: ok => {
      Store.answered(it.id, ok);
      ok ? D.right++ : (D.wrong++, D.missed.push(it));
      verdict(ok, it, `<div><div class="label">Use</div><b>${esc(it.term)}</b> &mdash; ${esc(it.meaning)}</div>`);
    }
  });
}

/* ------------------------------ mode: say it ---------------------------- */
function viewSpeak(it, body) {
  const target = it.example;
  const canListen = Speech.canListen();

  body.innerHTML = `
    <div class="stack">
      <div class="prompt">Say this sentence</div>
      <div class="card">
        <div class="row" style="align-items:flex-start">
          <div class="example" style="flex:1;font-size:19px">${esc(target)}</div>
          ${sayBtn(target)}
        </div>
        <p class="hint">Listen first, then copy the rhythm. Press <span class="kbd">P</span> to replay, <span class="kbd">0.7&times;</span> for slow.</p>
        <div class="row">
          <button class="btn ghost" id="slowBtn">Play slowly</button>
          <div class="spacer"></div>
        </div>
      </div>

      ${canListen ? `
        <div class="card mic-zone">
          <button class="mic" id="micBtn" title="Record" aria-label="Record">${icon("mic", 30)}</button>
          <div class="heard" id="heard">Tap the microphone and read the sentence aloud.</div>
          <div id="scoreBox"></div>
        </div>` : `
        <div class="notice">
          Your browser can&rsquo;t check pronunciation (speech recognition isn&rsquo;t available here &mdash;
          Chrome or Edge on desktop usually works). Keep going anyway: listen, repeat aloud twice,
          then mark how it felt.
        </div>`}

      <div class="prompt">How comfortable was that?</div>
      <div class="grade-row">
        <button class="grade" data-g="0">Struggled<small>repeat soon</small></button>
        <button class="grade" data-g="1">Okay<small>come back tomorrow</small></button>
        <button class="grade" data-g="2">Fluent<small>push it back</small></button>
      </div>
    </div>`;

  $("#slowBtn").onclick = () => Speech.speak(target, { rate: 0.7 });

  if (canListen) {
    const mic = $("#micBtn"), heard = $("#heard"), scoreBox = $("#scoreBox");
    let listening = false;
    mic.onclick = async () => {
      if (listening) { Speech.stopListening(); return; }
      listening = true;
      mic.classList.add("live");
      heard.textContent = "Listening\u2026";
      scoreBox.innerHTML = "";
      const said = await Speech.listen({
        onInterim: t => { heard.textContent = t || "Listening\u2026"; },
        onError: err => { heard.textContent = err === "not-allowed" ? "Microphone access was blocked." : "Didn\u2019t catch that \u2014 try again."; }
      });
      listening = false;
      mic.classList.remove("live");
      if (!said) return;
      const r = Speech.compare(target, said);
      heard.innerHTML = r.words.map(w => `<span class="${w.ok ? "hit" : "miss2"}">${esc(w.w)}</span>`).join(" ");
      const colour = r.score >= 85 ? "var(--good)" : r.score >= 60 ? "var(--warn)" : "var(--bad)";
      scoreBox.innerHTML =
        `<div style="font-size:30px;font-weight:700;color:${colour}">${r.score}%</div>
         <div class="hint">${r.score >= 85 ? "Clear and accurate." : r.score >= 60 ? "Close \u2014 the underlined words didn\u2019t come through." : "Slow down and try again, one clause at a time."}</div>`;
    };
  }

  $$(".grade").forEach(g => g.onclick = () => {
    Store.grade(it.id, +g.dataset.g);
    +g.dataset.g === 0 ? (D.wrong++, D.missed.push(it)) : D.right++;
    next();
  });
}

/* ------------------------------- summary -------------------------------- */
function renderSummary() {
  const total = D.right + D.wrong;
  const pct = total ? Math.round((D.right / total) * 100) : 0;
  const band = pct >= 80 ? "ok" : pct >= 50 ? "mid" : "no";
  const msg = pct >= 80 ? "Strong. These are becoming automatic."
            : pct >= 50 ? "Solid progress. The misses below are worth a second pass."
            : "Early days. Run the Learn mode once more, reading each sentence aloud.";

  $("#drillBar").style.width = "100%";
  $("#drillBody").innerHTML = `
    <div class="card summary fade-in">
      <div class="score ${band}">${pct}%</div>
      <div><b>${D.right} of ${total}</b> confident</div>
      <p class="lede" style="text-align:center">${msg}</p>
      ${D.missed.length ? `
        <div class="miss-list">
          <div class="label">Worth another look</div>
          ${[...new Set(D.missed)].map(m => `<div class="miss"><b>${esc(m.term)}</b> &mdash; ${esc(m.meaning)}</div>`).join("")}
        </div>` : ""}
      <div class="row" style="justify-content:center">
        <button class="btn primary" id="againBtn">Run it again</button>
        <button class="btn" id="doneBtn">${D.deckId === "__all" ? "Home" : "Back to deck"}</button>
      </div>
    </div>`;

  const back = D.deckId === "__all" ? "home" : "deck/" + D.deckId;
  $("#doneBtn").onclick = () => go(back);
  $("#againBtn").onclick = () => startDrill(D.deckId, D.mode);
}

/* ============================== DIALOGUES ================================ */
function renderDialogues() {
  view.replaceChildren(tpl("dialogues"));
  view.firstElementChild.classList.add("fade-in");

  $("#dlgList").innerHTML = DIALOGUES.map(d => `
    <div class="dlg" data-dlg="${d.id}">
      <button class="dlg-head" aria-expanded="false">
        <h3>${esc(d.title)}</h3>
        <span class="tag">${esc(deckById.get(d.deck)?.name ?? "")}</span>
        <span class="dlg-chev">${icon("chevron", 18)}</span>
      </button>
      <div class="dlg-body" hidden>
        ${d.lines.map((l, i) => `
          <div class="line ${l.who === "You" ? "you" : ""}">
            <span class="who">${esc(l.who)}</span>
            <span class="txt">${esc(l.text)}</span>
            ${sayBtn(l.text, "say sm")}
          </div>`).join("")}
        <div class="dlg-foot">
          <button class="btn ghost" data-play="${d.id}">Play the whole script</button>
          <button class="btn ghost" data-mine="${d.id}">Play only my lines</button>
        </div>
      </div>
    </div>`).join("");

  $("#dlgList").addEventListener("click", async e => {
    const head = e.target.closest(".dlg-head");
    if (head) {
      const body = head.nextElementSibling;
      body.hidden = !body.hidden;
      head.setAttribute("aria-expanded", String(!body.hidden));
      return;
    }
    const play = e.target.closest("[data-play]");
    const mine = e.target.closest("[data-mine]");
    if (!play && !mine) return;
    const id = (play || mine).dataset.play || (play || mine).dataset.mine;
    const d = DIALOGUES.find(x => x.id === id);
    const lines = mine ? d.lines.filter(l => l.who === "You") : d.lines;
    const btn = play || mine;
    const label = btn.textContent;
    btn.textContent = "Playing\u2026 (click to stop)";
    let stopped = false;
    const stop = () => { stopped = true; Speech.stop(); };
    btn.addEventListener("click", stop, { once: true });
    for (const l of lines) {
      if (stopped) break;
      await Speech.speak(l.text, { rate: 0.95 });
      await new Promise(r => setTimeout(r, mine ? 1200 : 450));
    }
    btn.textContent = label;
    btn.removeEventListener("click", stop);
  });
}

/* =============================== SEARCH ================================== */
const searchBox = $("#search");
const searchOut = $("#searchResults");

function runSearch(q) {
  q = q.trim().toLowerCase();
  if (q.length < 2) { searchOut.hidden = true; return; }

  const hits = ITEMS.map(it => {
    const t = it.term.toLowerCase();
    let s = 0;
    if (t === q) s = 100;
    else if (t.startsWith(q)) s = 60;
    else if (t.includes(q)) s = 45;
    if (it.avoid?.toLowerCase().includes(q)) s = Math.max(s, 50);
    if (it.meaning.toLowerCase().includes(q)) s = Math.max(s, 25);
    if (it.example.toLowerCase().includes(q)) s = Math.max(s, 18);
    if (it.also?.some(a => a.toLowerCase().includes(q))) s = Math.max(s, 30);
    return { it, s };
  }).filter(h => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 12);

  searchOut.hidden = false;
  searchOut.innerHTML = hits.length
    ? hits.map(h => `
        <button class="sr-item" data-id="${h.it.id}">
          <div class="sr-term">${esc(h.it.term)}</div>
          <div class="sr-meta">${esc(h.it.deckName)} &middot; ${esc(h.it.meaning)}</div>
        </button>`).join("")
    : `<div class="sr-empty">Nothing for &ldquo;${esc(q)}&rdquo;. Try a plainer word \u2014 <em>deadline</em>, <em>blocked</em>, <em>doubt</em>, <em>sorry</em>.</div>`;
}

let sTimer;
searchBox.addEventListener("input", () => { clearTimeout(sTimer); sTimer = setTimeout(() => runSearch(searchBox.value), 110); });
searchBox.addEventListener("focus", () => { if (searchBox.value.trim().length >= 2) runSearch(searchBox.value); });

searchOut.addEventListener("click", e => {
  const b = e.target.closest("[data-id]");
  if (!b) return;
  showItem(byId.get(b.dataset.id));
  searchOut.hidden = true;
  searchBox.blur();
});

document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrap")) searchOut.hidden = true;
});

function showItem(it) {
  view.innerHTML = `
    <section class="stack fade-in">
      <button class="back" data-go="deck/${it.deck}">${icon("arrowL", 15)}<span>${esc(it.deckName)}</span></button>
      ${fullCard(it)}
      <div class="row">
        <button class="btn primary" data-go="drill/${it.deck}/learn">Study this deck</button>
        <button class="btn" data-go="home">Home</button>
      </div>
    </section>`;
}

/* ============================== CHROME ================================== */
$("#homeBtn").onclick = () => go("home");

function paintStreak() {
  const n = Store.streak();
  $("#streak").innerHTML = n ? `${icon("flame", 15)}<b>${n}</b> day${n > 1 ? "s" : ""} in a row` : "";
}

const themeBtn = $("#themeBtn");
function applyTheme(t) {
  document.body.classList.toggle("light", t === "light");
  themeBtn.innerHTML = icon(t === "light" ? "moon" : "sun", 17);
  themeBtn.title = t === "light" ? "Switch to dark" : "Switch to light";
}
const prefersLight = () => !!window.matchMedia?.("(prefers-color-scheme: light)").matches;
applyTheme(Store.theme() ?? (prefersLight() ? "light" : "dark"));
themeBtn.onclick = () => {
  const t = document.body.classList.contains("light") ? "dark" : "light";
  Store.theme(t); applyTheme(t);
};

/* ----------------------------- keyboard --------------------------------- */
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") {
    if (e.key === "Escape") { e.target.value = ""; searchOut.hidden = true; e.target.blur(); }
    return;
  }
  if (e.key === "/") { e.preventDefault(); searchBox.focus(); return; }

  const reveal = $("#revealBtn");
  const nb = $("#nextBtn");
  const opts = $$(".opt:not(:disabled)");

  if (e.key === " " && reveal) { e.preventDefault(); reveal.click(); return; }
  if (e.key === "Enter" && nb) { e.preventDefault(); nb.click(); return; }
  if (/^[1-4]$/.test(e.key) && opts.length) { e.preventDefault(); opts[+e.key - 1]?.click(); return; }
  if (/^[1-3]$/.test(e.key)) { const g = $$(".grade")[+e.key - 1]; if (g) { e.preventDefault(); g.click(); return; } }
  if (e.key.toLowerCase() === "p") {
    const say = $$("[data-say]").pop();
    if (say) { e.preventDefault(); say.click(); }
  }
});

/* ------------------------------- boot ----------------------------------- */
route();
