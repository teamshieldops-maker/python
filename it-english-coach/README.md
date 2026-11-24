# IT English Coach

An interactive trainer for the English that software professionals actually use at
work: standups, code review, incident calls, estimates, client updates, interviews.

168 phrases across 10 workplace situations, each with a plain definition, a model
sentence you can copy verbatim, natural alternatives, and — where it matters — the
awkward version to avoid and why.

No build step, no server, no accounts, no network calls. Open `index.html` and it runs.
All progress stays in your browser's `localStorage`.

## Run it

```bash
# any static server, or just open the file
open index.html            # macOS
xdg-open index.html        # Linux
```

A single self-contained file is also built to `dist/it-english-coach.html` — one HTML
file with the CSS and JS inlined, handy for emailing or dropping on a shared drive:

```bash
npm run build
```

## What's in it

**Ten situation decks**

| Deck | What it covers |
| --- | --- |
| Daily Standup & Status | Reporting progress in fifteen seconds without rambling |
| Code Review & Pull Requests | Critiquing code, and taking criticism, without friction |
| Incidents, Outages & Debugging | Staying precise and blameless when production is on fire |
| Planning & Estimation | Realistic commitments, and pushing back constructively |
| Meeting Moves | Interrupting, disagreeing, clarifying, closing a decision |
| Clients & Stakeholders | Explaining technical reality without jargon or blame |
| Architecture & Design Debates | Arguing about systems with precision instead of volume |
| Email, Slack & Docs | Written messages people actually read and act on |
| Interviews, 1:1s & Feedback | Talking about your own work and needs without shrinking |
| Fix These Habits | Phrases that sound normal at work but confuse international colleagues |

**Six drill modes per deck**

- **Learn** — the full card: meaning, model sentence, alternatives, pitfalls, usage note.
- **Flashcards** — see the meaning, recall the phrase, then self-grade. Feeds the review scheduler.
- **Quiz** — multiple choice, meaning to phrase.
- **Fill the gap** — complete a real sentence with the right phrase.
- **Spot the mistake** — pick the natural sentence out of four, three of them awkward.
- **Say it** — read the sentence aloud; the browser plays a model and scores your attempt word by word.

**Today's review** mixes whatever is due across all ten decks into one short session.

## How the scheduling works

A five-box Leitner scheme. Each phrase sits in a box; a correct answer moves it up,
forgetting sends it back to box 0.

| Box | Next shown in |
| --- | --- |
| 0 | same day |
| 1 | 1 day |
| 2 | 2 days |
| 3 | 4 days |
| 4 | 9 days |
| 5 | 21 days |

Box 4 or higher counts as *mastered*. Ten minutes a day beats one long Sunday session.

## Speech support

| Feature | Requirement | Without it |
| --- | --- | --- |
| Listening to phrases and sentences | `SpeechSynthesis` — all current browsers | Buttons stay silent; everything else works |
| Scoring your spoken attempt | `SpeechRecognition` — Chrome/Edge on desktop | "Say it" shows a note and falls back to self-grading |

Recognition scoring compares your words against the target, ignoring articles and
accepting contractions (`I'm` = `I am`) and both `-ise`/`-ize` spellings. It measures
word accuracy, not accent.

## Keyboard

| Key | Does |
| --- | --- |
| `/` | Jump to search |
| `1`–`4` | Pick a multiple-choice option |
| `1`–`3` | Pick a self-grade (No idea / Shaky / Knew it) |
| `Space` | Reveal a flashcard |
| `Enter` | Next question |
| `P` | Replay the current sentence |
| `Esc` | Clear search |

## Tests

```bash
npm install     # jsdom, the only dependency, and only for tests
npm test
```

`test/smoke.mjs` loads the real `index.html` in jsdom and clicks through every view and
all six drill modes — 67 assertions covering rendering, navigation, answer grading,
search, the dialogue player, localStorage persistence, and the spaced-repetition maths.

## Layout

```
index.html         markup and view templates
styles.css         all styling, dark and light themes
js/data.js         the phrase bank and the practice dialogues  <- edit this to add content
js/store.js        progress, streaks and the Leitner scheduler
js/speech.js       text-to-speech, recognition, answer comparison
js/app.js          router, views, drill engine, icons
test/smoke.mjs     headless integration test
```

## Adding your own phrases

Append to the relevant deck in `js/data.js`. Only `term`, `meaning` and `example` are
required:

```js
{
  term: "circle back",
  meaning: "Return to a topic later rather than discussing it now.",
  example: "That's a bigger design question \u2014 can we circle back after standup?",
  also: ["take it offline", "park that"],   // optional: natural alternatives
  avoid: "Let us discuss about it later.",  // optional: feeds "Spot the mistake"
  note: "Protects the room's time without dismissing the person."   // optional
}
```

Everything else — drills, search, the review queue, progress — picks it up automatically.
If the `example` contains the `term` verbatim, "Fill the gap" can use it too.
