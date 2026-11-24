/* ------------------------------------------------------------------
   Progress storage — a small Leitner-box spaced repetition scheme.
   Everything lives in localStorage; nothing leaves the browser.
   ------------------------------------------------------------------ */

const Store = (() => {
  const KEY = "it-english-coach/v1";

  // Days until an item is due again, by box.
  const INTERVALS = [0, 1, 2, 4, 9, 21];
  const MAX_BOX = INTERVALS.length - 1;

  const blank = () => ({
    items: {},                 // id -> { box, due, seen, right, wrong }
    quiz: { right: 0, wrong: 0 },
    days: [],                  // ISO date strings on which the user practised
    theme: null
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return Object.assign(blank(), JSON.parse(raw));
    } catch {
      return blank();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
  }

  const today = () => new Date().toISOString().slice(0, 10);

  function addDay(d) {
    if (!state.days.includes(d)) { state.days.push(d); state.days.sort(); }
  }

  function rec(id) {
    if (!state.items[id]) state.items[id] = { box: 0, due: today(), seen: 0, right: 0, wrong: 0 };
    return state.items[id];
  }

  /** Record an answer. grade: 0 = forgot, 1 = shaky, 2 = knew it. */
  function grade(id, g) {
    const r = rec(id);
    r.seen++;
    if (g >= 2)      { r.box = Math.min(MAX_BOX, r.box + 1); r.right++; }
    else if (g === 1){ r.box = Math.max(1, r.box); r.right++; }
    else             { r.box = 0; r.wrong++; }

    const d = new Date();
    d.setDate(d.getDate() + INTERVALS[r.box]);
    r.due = d.toISOString().slice(0, 10);

    addDay(today());
    save();
    return r;
  }

  function answered(id, correct) {
    state.quiz[correct ? "right" : "wrong"]++;
    grade(id, correct ? 2 : 0);
  }

  function markSeen(id) {
    const r = rec(id);
    if (r.seen === 0) r.seen = 1;
    addDay(today());
    save();
  }

  const box = id => state.items[id]?.box ?? 0;
  const isDue = id => {
    const r = state.items[id];
    if (!r) return true;                // never studied -> available
    return r.due <= today();
  };
  const mastered = id => box(id) >= 4;
  const started = id => (state.items[id]?.seen ?? 0) > 0;

  /** Consecutive days practised, counting back from today or yesterday. */
  function streak() {
    if (!state.days.length) return 0;
    const set = new Set(state.days);
    const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function accuracy() {
    const { right, wrong } = state.quiz;
    const t = right + wrong;
    return t ? Math.round((right / t) * 100) : null;
  }

  function theme(v) {
    if (v === undefined) return state.theme;
    state.theme = v; save();
  }

  function reset() { state = blank(); save(); }

  return { grade, answered, markSeen, box, isDue, mastered, started, streak, accuracy, theme, reset, MAX_BOX };
})();
