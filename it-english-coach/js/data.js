/* ------------------------------------------------------------------
   IT English Coach — content bank
   Each item:
     term    : the phrase to learn
     meaning : plain-English definition
     example : a full, natural sentence an IT professional would say
     also    : near-equivalents you can swap in
     avoid   : the awkward/incorrect version many speakers use
     note    : register, nuance, or a usage warning
   ------------------------------------------------------------------ */

const DECKS = [
  {
    id: "standup",
    name: "Daily Standup & Status",
    icon: "bubble",
    blurb: "Report progress in fifteen seconds without rambling.",
    items: [
      {
        term: "blocked on",
        meaning: "Unable to make progress because you are waiting for something or someone.",
        example: "I'm blocked on the staging credentials \u2014 I can't verify the integration until infra provisions them.",
        also: ["held up by", "waiting on"],
        avoid: "I am in blocking. / I have a blocker from infra team.",
        note: "Blocked ON a thing, blocked BY a person's action. 'I have a blocker' is fine too."
      },
      {
        term: "wrapped up",
        meaning: "Finished something completely.",
        example: "I wrapped up the payment retry logic yesterday and it's merged to develop.",
        also: ["finished off", "closed out"],
        avoid: "I completed it fully done."
      },
      {
        term: "picking up",
        meaning: "Starting work on a task, usually one that was waiting in the backlog.",
        example: "Today I'm picking up the ticket for the session-timeout bug.",
        also: ["taking on", "starting on"],
        note: "Very common in standups. 'I'll pick that up' = 'I volunteer for it.'"
      },
      {
        term: "on track",
        meaning: "Progressing at the speed needed to hit the deadline.",
        example: "We're still on track for Thursday's release \u2014 nothing has changed since Monday.",
        also: ["on schedule", "tracking well"],
        avoid: "We are in track. / We are on the track."
      },
      {
        term: "slipping",
        meaning: "Falling behind schedule.",
        example: "The migration is slipping by about two days because the data cleanup took longer than we estimated.",
        also: ["running behind", "at risk"],
        note: "Say it early. 'This is at risk' is the professional way to raise a flag before it becomes a problem."
      },
      {
        term: "circle back",
        meaning: "Return to a topic later rather than discussing it now.",
        example: "That's a bigger design question \u2014 can we circle back after standup?",
        also: ["take it offline", "park that"],
        note: "The polite way to protect everyone's time without dismissing the person."
      },
      {
        term: "take it offline",
        meaning: "Move a discussion out of the group meeting into a smaller conversation.",
        example: "Let's take this offline \u2014 Priya and I will sort out the schema and share a summary.",
        note: "'Offline' here means 'not in this meeting'. It has nothing to do with the internet."
      },
      {
        term: "heads-up",
        meaning: "An advance warning so people can prepare.",
        example: "Quick heads-up: I'm on leave Friday, so someone else will need to cover the deploy.",
        also: ["FYI", "flagging early"],
        avoid: "Heads up to inform you that...",
        note: "Noun: 'a heads-up'. Verb form: 'I wanted to give you a heads-up.'"
      },
      {
        term: "a quick one",
        meaning: "A short request or question that won't take much time.",
        example: "A quick one for the backend folks \u2014 is the v2 endpoint live in QA yet?",
        note: "Signals you respect the room's time. Then actually be quick."
      },
      {
        term: "no blockers",
        meaning: "Nothing is stopping your work.",
        example: "Same as yesterday, no blockers \u2014 I should have the PR up by lunch.",
        avoid: "No blockage. / Nothing is blocking to me."
      },
      {
        term: "in review",
        meaning: "Work is complete but waiting for someone to approve it.",
        example: "The caching change is in review \u2014 I just need a second approval to merge.",
        also: ["up for review", "awaiting review"]
      },
      {
        term: "spun up",
        meaning: "Created and started a new environment, service, or instance.",
        example: "I spun up a test cluster to reproduce the memory leak in isolation.",
        also: ["stood up", "provisioned"]
      },
      {
        term: "loop in",
        meaning: "Include someone in a conversation so they have the context.",
        example: "I'll loop in the security team before we touch the auth flow.",
        also: ["bring in", "pull in"],
        avoid: "I will loop him. / I will include him in loop.",
        note: "Loop someone IN. 'Keep me in the loop' = keep me informed."
      },
      {
        term: "bandwidth",
        meaning: "The spare time and attention a person has for extra work.",
        example: "I don't have the bandwidth to take that on this sprint \u2014 could it go to the next one?",
        note: "A graceful way to decline without saying 'I'm too busy', which can sound dismissive."
      },
      {
        term: "ramping up on",
        meaning: "Getting familiar with something new before being fully productive on it.",
        example: "I'm still ramping up on the billing service, so I paired with Dinesh for the first ticket.",
        also: ["getting up to speed on"],
        avoid: "I am still learning the knowledge of billing service."
      },
      {
        term: "give or take",
        meaning: "Approximately; a little more or less.",
        example: "The import takes about forty minutes, give or take.",
        note: "A natural way to signal an estimate instead of a promise."
      },
      {
        term: "shipped",
        meaning: "Released to users.",
        example: "We shipped the new onboarding flow to ten percent of users last night.",
        also: ["went live", "rolled out"],
        avoid: "We have done the deployment to live."
      },
      {
        term: "the long and short of it",
        meaning: "A one-line summary of a complicated situation.",
        example: "The long and short of it is that the vendor changed their API without telling us.",
        also: ["in a nutshell", "bottom line"],
        note: "Perfect opener when a manager asks 'what happened?' and you have five minutes of detail."
      }
    ]
  },

  {
    id: "review",
    name: "Code Review & Pull Requests",
    icon: "search",
    blurb: "Critique code, not people \u2014 and take criticism gracefully.",
    items: [
      {
        term: "nit",
        meaning: "A tiny, optional comment about style that shouldn't block the merge.",
        example: "Nit: could we rename `tmp` to `pendingInvoices`? Non-blocking, happy to approve either way.",
        also: ["minor", "optional"],
        note: "Short for 'nitpick'. Labelling it 'nit' tells the author they can ignore it without guilt."
      },
      {
        term: "blocking comment",
        meaning: "An objection serious enough that the change shouldn't merge until it's resolved.",
        example: "This one is blocking \u2014 we'd be logging raw card numbers, which breaks our PCI rules.",
        note: "Always say whether a comment is blocking or not. It removes all the guesswork."
      },
      {
        term: "I'd lean towards",
        meaning: "A soft way to state a preference that leaves room for disagreement.",
        example: "I'd lean towards extracting this into a helper, but I don't feel strongly about it.",
        also: ["I'd be inclined to", "my preference would be"],
        avoid: "You should do like this."
      },
      {
        term: "what's the thinking behind",
        meaning: "A non-confrontational way to ask why a decision was made.",
        example: "What's the thinking behind polling here rather than using the webhook?",
        also: ["help me understand why", "what drove the decision to"],
        avoid: "Why you did like this? / Why this is written in this way?",
        note: "Assumes the author had a reason. Often they did, and you learn something."
      },
      {
        term: "good catch",
        meaning: "Acknowledgement that a reviewer found a real problem.",
        example: "Good catch \u2014 that off-by-one would have dropped the last page of results. Fixed in the latest commit.",
        note: "Two words that make code review feel collaborative instead of adversarial. Use them often."
      },
      {
        term: "fair point",
        meaning: "Agreeing that someone's objection is reasonable.",
        example: "Fair point on the retry limit \u2014 I've capped it at five and added a backoff.",
        also: ["that's fair", "you're right"]
      },
      {
        term: "I'll push a fix",
        meaning: "You will commit a correction shortly.",
        example: "Agreed, I'll push a fix for the null check this afternoon.",
        avoid: "I will do the needful and update.",
        note: "Say what you'll do and roughly when. That's all a reviewer wants."
      },
      {
        term: "out of scope",
        meaning: "A valid concern that belongs in different work, not this change.",
        example: "That refactor is out of scope for this PR \u2014 I've raised PLAT-412 to track it separately.",
        note: "The professional way to say 'not now' without saying 'never'. Always file the ticket."
      },
      {
        term: "edge case",
        meaning: "An unusual input or situation at the limits of normal use.",
        example: "What happens in the edge case where the user's token expires mid-upload?",
        also: ["corner case"],
        avoid: "What about the rare cases happening?"
      },
      {
        term: "happy path",
        meaning: "The scenario where everything works as expected.",
        example: "The happy path looks solid \u2014 I'd like to see a test for the timeout branch too.",
        note: "Pairs naturally with 'sad path' or 'failure path'."
      },
      {
        term: "flaky",
        meaning: "A test that passes and fails inconsistently without code changes.",
        example: "That test is flaky, not broken \u2014 it fails roughly one run in twenty because of a race condition.",
        avoid: "The test is failing sometimes only."
      },
      {
        term: "defer to you",
        meaning: "Letting someone else's judgement decide because they know the area better.",
        example: "You own this service, so I'll defer to you on the naming \u2014 both options read fine to me.",
        note: "Shows confidence rather than weakness. Senior engineers do this constantly."
      },
      {
        term: "squash and merge",
        meaning: "Combine all commits in a branch into one before merging.",
        example: "Once CI is green, squash and merge \u2014 the twelve WIP commits don't add anything to the history.",
        also: ["rebase and merge", "fast-forward"]
      },
      {
        term: "LGTM",
        meaning: "Looks good to me \u2014 approval.",
        example: "LGTM with one small nit, feel free to merge once you've had a look.",
        note: "Written shorthand only. Don't say 'L-G-T-M' aloud in a meeting; say 'looks good to me'."
      },
      {
        term: "tighten up",
        meaning: "Make something more precise, concise, or robust.",
        example: "Can we tighten up the error message so it tells the user what to do next?",
        also: ["clean up", "firm up"]
      },
      {
        term: "I may be missing context",
        meaning: "A hedge that softens criticism and invites explanation.",
        example: "I may be missing context here, but doesn't the gateway already validate this?",
        note: "Protects you from looking foolish and the author from feeling attacked. Excellent phrase."
      },
      {
        term: "knock-on effect",
        meaning: "An indirect consequence elsewhere in the system.",
        example: "Changing the default page size has a knock-on effect on the mobile client's pagination.",
        also: ["ripple effect", "downstream impact"]
      },
      {
        term: "ship it",
        meaning: "Informal approval \u2014 release it as it is.",
        example: "Tests are green and the rollback plan is documented. Ship it.",
        note: "Casual. Fine with your team, too breezy for an external stakeholder."
      }
    ]
  },

  {
    id: "incident",
    name: "Incidents, Outages & Debugging",
    icon: "alert",
    blurb: "Stay calm, precise, and blameless when production is on fire.",
    items: [
      {
        term: "I'm seeing",
        meaning: "Reporting a live observation without yet claiming a cause.",
        example: "I'm seeing a spike in 502s from the EU region starting around 14:10 UTC.",
        avoid: "The site is down fully. / Everything is not working.",
        note: "Separate what you observe from what you conclude. This habit alone makes you sound senior."
      },
      {
        term: "narrow it down",
        meaning: "Reduce the number of possible causes.",
        example: "We've narrowed it down to the connection pool \u2014 the app servers are healthy.",
        also: ["isolate", "rule out"]
      },
      {
        term: "rule out",
        meaning: "Eliminate something as a possible cause.",
        example: "We've ruled out the CDN \u2014 the errors reproduce when we hit the origin directly.",
        avoid: "CDN is not the issue, it is confirmed to not be."
      },
      {
        term: "reproduce",
        meaning: "Make a bug happen again deliberately.",
        example: "I can reproduce it consistently with a payload over two megabytes.",
        also: ["repro (noun)"],
        avoid: "I am able to regenerate the issue."
      },
      {
        term: "intermittent",
        meaning: "Happening irregularly, not every time.",
        example: "The failures are intermittent \u2014 roughly one request in two hundred, with no obvious pattern.",
        also: ["sporadic", "transient"],
        avoid: "It is coming and going randomly only."
      },
      {
        term: "root cause",
        meaning: "The underlying reason, not just the visible symptom.",
        example: "The root cause was an expired certificate; the 502s were just the symptom.",
        note: "Don't say 'root cause' until you actually know. Before that, say 'leading hypothesis'."
      },
      {
        term: "mitigate",
        meaning: "Reduce the impact now, even without a permanent fix.",
        example: "We've mitigated it by failing over to the secondary region while we work on a proper fix.",
        also: ["stop the bleeding", "contain"],
        note: "Mitigation first, root cause second. Saying it in that order reassures stakeholders."
      },
      {
        term: "roll back",
        meaning: "Revert to the previous working version.",
        example: "Let's roll back to build 4412 and investigate with the pressure off.",
        avoid: "Let us do the rollbacking. / Revert back the deployment.",
        note: "Two words as a verb ('roll back'), one word as a noun ('the rollback')."
      },
      {
        term: "blast radius",
        meaning: "How much of the system or how many users a problem affects.",
        example: "The blast radius is limited to enterprise customers on the legacy plan \u2014 around four hundred accounts.",
        also: ["scope of impact"]
      },
      {
        term: "all hands on deck",
        meaning: "Everyone available is needed.",
        example: "It's all hands on deck until checkout is restored \u2014 everything else can wait.",
        note: "Use sparingly. If every week is all hands on deck, the phrase stops meaning anything."
      },
      {
        term: "paged",
        meaning: "Alerted automatically, usually outside working hours.",
        example: "I got paged at three in the morning when the queue depth crossed the threshold.",
        also: ["alerted", "on call"]
      },
      {
        term: "known issue",
        meaning: "A problem the team is already aware of and tracking.",
        example: "That's a known issue \u2014 it's tracked in INC-889 and a fix is in this week's release.",
        note: "Reassures the reporter they aren't being ignored, which is usually their real worry."
      },
      {
        term: "post-mortem",
        meaning: "A written review after an incident to find out what happened and what to improve.",
        example: "I'll write up the post-mortem by Thursday and circulate it before we meet.",
        also: ["incident review", "retrospective"],
        note: "Modern practice is 'blameless post-mortem' \u2014 focus on the system, not the person."
      },
      {
        term: "degraded",
        meaning: "Working, but worse than normal.",
        example: "Search is degraded rather than down \u2014 results are returning, just slowly.",
        avoid: "It is half working.",
        note: "A precise word stakeholders understand. Use it instead of 'down' when things still partly work."
      },
      {
        term: "hotfix",
        meaning: "An urgent, narrowly scoped fix pushed outside the normal release cycle.",
        example: "We shipped a hotfix for the login loop and we'll fold the proper fix into Friday's release.",
        avoid: "We did the patching urgently."
      },
      {
        term: "I'll keep you posted",
        meaning: "A promise to give regular updates.",
        example: "We're still investigating \u2014 I'll keep you posted every twenty minutes, even if nothing has changed.",
        also: ["I'll update you as we learn more"],
        avoid: "I will revert back to you shortly.",
        note: "'Revert back' means 'change back to a previous state' in English, not 'reply'. Avoid it entirely."
      },
      {
        term: "best guess at this point",
        meaning: "Giving an honest provisional answer while flagging the uncertainty.",
        example: "My best guess at this point is a config drift between regions, but I wouldn't bet the release on it.",
        note: "Lets you answer 'what's causing it?' honestly without committing to a wrong theory."
      },
      {
        term: "stand down",
        meaning: "End the emergency response because the issue is resolved.",
        example: "Error rates have been flat for thirty minutes \u2014 I think we can stand down and pick up the follow-ups tomorrow.",
        also: ["close the incident"]
      }
    ]
  },

  {
    id: "planning",
    name: "Planning & Estimation",
    icon: "calendar",
    blurb: "Commit to realistic dates and push back without sounding negative.",
    items: [
      {
        term: "a rough estimate",
        meaning: "An approximate figure given with the uncertainty acknowledged.",
        example: "A rough estimate would be three to four days, though I'd want to spike the auth piece first.",
        also: ["a ballpark figure", "an order of magnitude"],
        avoid: "I will tell exactly two days.",
        note: "Never give a single number for unfamiliar work. Give a range, then narrow it."
      },
      {
        term: "spike",
        meaning: "A short, time-boxed investigation to reduce uncertainty before estimating.",
        example: "Give me a two-day spike on the vendor SDK and I'll come back with a real estimate.",
        note: "The single most useful word for escaping 'how long will it take?' when you genuinely don't know."
      },
      {
        term: "scope creep",
        meaning: "Work quietly expanding beyond what was agreed.",
        example: "We've had some scope creep \u2014 the original ticket didn't mention bulk import or audit logs.",
        avoid: "The requirement is increasing day by day."
      },
      {
        term: "de-risk",
        meaning: "Reduce the chance of something going wrong, usually by doing the uncertain part first.",
        example: "Let's de-risk the migration by running it against a production copy this week.",
        also: ["reduce risk", "front-load the risk"]
      },
      {
        term: "nice to have",
        meaning: "Desirable but not essential.",
        example: "Dark mode is a nice to have \u2014 I'd cut it before I'd cut the accessibility work.",
        also: ["non-essential"],
        note: "Pairs with 'must have' and 'should have'. Useful for negotiating a release down to something achievable."
      },
      {
        term: "what would you like me to drop",
        meaning: "Pushing back on new work by asking what gets traded away.",
        example: "I can take the reporting feature, but what would you like me to drop to make room for it?",
        note: "The best pushback phrase in professional English. It's cooperative, not obstructive, and it forces an honest priority call."
      },
      {
        term: "hard deadline",
        meaning: "A date that genuinely cannot move.",
        example: "Is the tenth a hard deadline, or is it the date we'd like to hit?",
        also: ["a firm date", "a target date"],
        note: "Worth asking explicitly. Half of all 'urgent' deadlines turn out to be preferences."
      },
      {
        term: "dependency",
        meaning: "Something your work needs from elsewhere before it can finish.",
        example: "Our only external dependency is the vendor's sandbox, and they've promised access by Monday.",
        avoid: "We are dependent on them only."
      },
      {
        term: "critical path",
        meaning: "The chain of tasks that determines the earliest possible finish date.",
        example: "The schema change is on the critical path, so any delay there pushes the whole release.",
        note: "Says 'this specific item controls the date', which is far more persuasive than 'it's important'."
      },
      {
        term: "buffer",
        meaning: "Extra time deliberately added for the unexpected.",
        example: "I've built in two days of buffer for the integration testing \u2014 vendors are rarely ready on day one.",
        also: ["contingency", "slack"]
      },
      {
        term: "break it down",
        meaning: "Split large work into smaller, estimable pieces.",
        example: "That's too big to estimate as one ticket \u2014 let me break it down into the API, the UI, and the migration.",
        also: ["decompose", "slice it up"]
      },
      {
        term: "carry over",
        meaning: "Move unfinished work into the next sprint.",
        example: "Two tickets will carry over, mostly because the review queue was long last week.",
        avoid: "It will be carried forward to next sprint only."
      },
      {
        term: "capacity",
        meaning: "How much work a team can realistically take on in a period.",
        example: "With Arun on leave, our capacity is down about twenty percent this sprint.",
        also: ["throughput", "velocity"],
        note: "'Capacity' is about the team; 'bandwidth' is about an individual."
      },
      {
        term: "I'd rather under-promise",
        meaning: "Choosing a conservative commitment you can beat.",
        example: "I'd rather under-promise and deliver early than commit to Friday and miss it.",
        note: "Frames caution as reliability instead of pessimism."
      },
      {
        term: "happy to be challenged on this",
        meaning: "Inviting disagreement about your own estimate or plan.",
        example: "That's my read on the sequencing, and I'm happy to be challenged on it.",
        note: "Signals confidence and openness at the same time. Very senior-sounding."
      },
      {
        term: "stretch goal",
        meaning: "An ambitious extra target that isn't a commitment.",
        example: "Shipping the analytics dashboard this sprint is a stretch goal, not a commitment."
      },
      {
        term: "trade-off",
        meaning: "Accepting a loss in one area to gain in another.",
        example: "The trade-off is a slower write path for much faster reads \u2014 given our traffic, that's the right call.",
        avoid: "There is a trade off in between both.",
        note: "Naming the trade-off explicitly is what separates an engineer from a code typist."
      }
    ]
  },

  {
    id: "meetings",
    name: "Meeting Moves",
    icon: "exchange",
    blurb: "Interrupt, disagree, clarify and close \u2014 politely and confidently.",
    items: [
      {
        term: "can I jump in here",
        meaning: "A polite way to interrupt.",
        example: "Can I jump in here? I think we're solving a problem we don't have yet.",
        also: ["sorry to interrupt", "if I could add to that"],
        avoid: "One second, listen to me. / Excuse me, excuse me.",
        note: "Say the phrase, pause for half a second, then speak. The pause is what makes it polite."
      },
      {
        term: "just to make sure I've understood",
        meaning: "Restating something to confirm you got it right.",
        example: "Just to make sure I've understood \u2014 you want the export to run nightly, not on demand?",
        also: ["let me play that back to you", "so if I've got this right"],
        avoid: "I have one doubt. / Come again?",
        note: "The single most valuable phrase for non-native speakers. It fixes misunderstandings before they cost a sprint."
      },
      {
        term: "I have a question",
        meaning: "The correct way to say you want to ask something.",
        example: "I have a question about the retention policy \u2014 how long do we keep the raw events?",
        avoid: "I have a doubt.",
        note: "In English, 'doubt' means you suspect something is false. 'I have a doubt about your plan' sounds like distrust. Always say 'question'."
      },
      {
        term: "I see it differently",
        meaning: "Disagreeing firmly without being rude.",
        example: "I see it differently \u2014 I think the cost of the rewrite outweighs the maintenance saving.",
        also: ["I'm not sure I agree", "my read is different"],
        avoid: "No, that is wrong. / I don't think so, it is not correct."
      },
      {
        term: "that's a good point, and",
        meaning: "Acknowledging someone before adding a counterpoint.",
        example: "That's a good point, and I'd add that we'd still need to support the old clients for a year.",
        note: "Use 'and' rather than 'but'. 'But' erases everything before it; 'and' builds on it."
      },
      {
        term: "devil's advocate",
        meaning: "Arguing against an idea to test it, not because you believe the argument.",
        example: "Let me play devil's advocate \u2014 what if the traffic never reaches the volume we're designing for?",
        note: "Lets you stress-test a popular idea without being seen as the obstacle."
      },
      {
        term: "where are we landing on",
        meaning: "Asking the group to reach a decision.",
        example: "Where are we landing on the database choice? We need to decide today to keep the schema work moving.",
        also: ["what's the decision here", "can we close this out"],
        note: "Rescues meetings that have circled the same point three times."
      },
      {
        term: "I'll take that away",
        meaning: "Accepting an action item to do after the meeting.",
        example: "I'll take that away and come back with numbers by Wednesday.",
        also: ["that's on me", "I'll own that"],
        avoid: "I will do the needful."
      },
      {
        term: "for the benefit of the room",
        meaning: "Repeating or explaining something so everyone has the context.",
        example: "For the benefit of the room \u2014 we tried this approach in 2024 and hit rate limits almost immediately.",
        note: "Lets you share history without sounding like you're lecturing the newcomers."
      },
      {
        term: "let's park that",
        meaning: "Deliberately postpone a topic and record it so it isn't lost.",
        example: "Let's park the pricing discussion and pick it up when Finance can join.",
        also: ["put a pin in that", "add it to the parking lot"]
      },
      {
        term: "could you expand on that",
        meaning: "Asking for more detail.",
        example: "Could you expand on the security concern? I want to make sure I'm designing for the right threat.",
        also: ["could you say a bit more about", "what do you mean by"],
        avoid: "Explain me that. / Please elaborate it.",
        note: "'Explain me' is wrong \u2014 it's 'explain it to me'. Safer to just say 'could you expand on that'."
      },
      {
        term: "I don't have that in front of me",
        meaning: "Admitting you lack the information right now, professionally.",
        example: "I don't have those numbers in front of me \u2014 let me check and send them straight after this.",
        note: "Far better than guessing. Buys time without looking unprepared."
      },
      {
        term: "to be clear",
        meaning: "Introducing a precise restatement to remove ambiguity.",
        example: "To be clear, I'm not against the rewrite \u2014 I'm against doing it in the same quarter as the migration.",
        also: ["to put it plainly"]
      },
      {
        term: "we're going round in circles",
        meaning: "Pointing out that discussion is repeating without progress.",
        example: "I think we're going round in circles \u2014 shall we list the two options and vote?",
        note: "Name the problem, then immediately offer a way out. Never just name it."
      },
      {
        term: "unpack that",
        meaning: "Examine something complex in detail, piece by piece.",
        example: "There are three separate issues bundled in there \u2014 can we unpack them one at a time?",
        also: ["pull that apart", "separate those out"]
      },
      {
        term: "my two cents",
        meaning: "Offering an opinion modestly.",
        example: "My two cents: the simpler option will be easier to hand over when the team grows.",
        also: ["for what it's worth"],
        note: "Informal. Fine internally; use 'my view would be' with clients."
      },
      {
        term: "does that work for everyone",
        meaning: "Checking for agreement before closing a decision.",
        example: "So we'll go with option B and review it in a month. Does that work for everyone?",
        note: "Closing a meeting with a confirmed decision is a leadership habit, regardless of your title."
      }
    ]
  },

  {
    id: "client",
    name: "Clients & Stakeholders",
    icon: "users",
    blurb: "Explain technical reality to non-technical people without jargon or blame.",
    items: [
      {
        term: "in plain terms",
        meaning: "Signalling you're about to drop the jargon.",
        example: "In plain terms, the search index is a day out of date, so new products take until tomorrow to appear.",
        also: ["put simply", "the short version is"],
        note: "Say it, then actually use simple words. No 'in plain terms, the Kafka consumer lag...'."
      },
      {
        term: "what that means for you",
        meaning: "Translating a technical fact into customer impact.",
        example: "We're replacing the payment gateway. What that means for you is a two-hour maintenance window on Sunday morning.",
        note: "The habit that makes engineers trusted by business people. Always end a technical answer with this."
      },
      {
        term: "I want to set expectations",
        meaning: "Stating limits clearly and early.",
        example: "I want to set expectations \u2014 we can show a working prototype by the fifteenth, but not a production-ready system.",
        also: ["to be upfront with you"],
        avoid: "It is not possible like that."
      },
      {
        term: "let me come back to you on that",
        meaning: "Deferring an answer you don't have, with a commitment to follow up.",
        example: "Good question \u2014 let me come back to you on that by end of day with the exact figures.",
        avoid: "I will revert back to you. / I will tell you later only.",
        note: "Always attach a time. An open-ended 'I'll come back to you' feels like a brush-off."
      },
      {
        term: "I appreciate the frustration",
        meaning: "Acknowledging someone's feelings before explaining.",
        example: "I appreciate the frustration \u2014 three outages in a month isn't acceptable, and here's what we're changing.",
        also: ["I understand this has been disruptive"],
        note: "Acknowledge first, explain second. Reversing the order sounds like excuses."
      },
      {
        term: "that's on us",
        meaning: "Taking responsibility plainly.",
        example: "The data mismatch was on us \u2014 we missed it in testing, and we've added a check so it can't recur.",
        note: "Owning a mistake cleanly builds more trust than a flawless record. Say it without hedging."
      },
      {
        term: "a workaround",
        meaning: "A temporary way to get the job done while the real fix is pending.",
        example: "There's a workaround in the meantime \u2014 you can export to CSV and upload it manually.",
        also: ["an interim solution", "a stopgap"]
      },
      {
        term: "walk you through",
        meaning: "Explain something step by step.",
        example: "Let me walk you through what happened, and then I'll cover what we're doing about it.",
        also: ["take you through"],
        avoid: "I will explain you the process."
      },
      {
        term: "as it stands",
        meaning: "Describing the current situation, implying it might change.",
        example: "As it stands, the report runs weekly. We can make it daily, but it would add about a week of work.",
        also: ["at the moment", "currently"]
      },
      {
        term: "that's technically possible, but",
        meaning: "Saying yes to feasibility while flagging the real cost.",
        example: "That's technically possible, but it would mean rebuilding the permissions model \u2014 roughly six weeks.",
        note: "Lets you avoid a flat 'no' while making the cost impossible to ignore."
      },
      {
        term: "help me understand the use case",
        meaning: "Asking what someone actually needs, rather than arguing about their proposed solution.",
        example: "Before we build the custom export \u2014 help me understand the use case. Who reads the file, and what do they do with it?",
        note: "Half of all feature requests dissolve into something simpler once you ask this."
      },
      {
        term: "manage the risk",
        meaning: "Explaining how a known danger will be controlled.",
        example: "We can't eliminate the risk of data drift entirely, but we can manage it with nightly reconciliation and alerts.",
        avoid: "There will be no risk at all, don't worry."
      },
      {
        term: "I'd caution against",
        meaning: "A formal, diplomatic warning.",
        example: "I'd caution against going live the week before year-end close \u2014 if anything breaks, the timing is unforgiving.",
        also: ["I'd be wary of", "my concern would be"]
      },
      {
        term: "to close the loop",
        meaning: "Following up to confirm something is finished.",
        example: "Just to close the loop on last week's issue \u2014 the fix went out Monday and error rates are back to normal.",
        note: "A short closing-the-loop message is the cheapest way to look reliable."
      },
      {
        term: "ballpark",
        meaning: "An approximate figure, usually for cost or time.",
        example: "Ballpark, you're looking at eight to ten weeks, and I'll firm that up after the discovery phase.",
        note: "Say 'ballpark' before any number you don't want quoted back to you as a commitment."
      },
      {
        term: "single source of truth",
        meaning: "The one authoritative place where data is correct.",
        example: "We should agree on a single source of truth for customer status, otherwise the two dashboards will keep disagreeing.",
        avoid: "Both systems are having the data, so confusion is there."
      }
    ]
  },

  {
    id: "design",
    name: "Architecture & Design Debates",
    icon: "layers",
    blurb: "Argue about systems with precision instead of volume.",
    items: [
      {
        term: "the main constraint is",
        meaning: "Naming the limit that shapes the whole design.",
        example: "The main constraint is that the vendor API allows sixty calls a minute, so everything has to be batched.",
        note: "Starting with constraints instead of your favourite technology is the mark of a good designer."
      },
      {
        term: "coupling",
        meaning: "How much one component depends on the internals of another.",
        example: "Reading the other service's database directly creates coupling we'll regret the first time they change a column.",
        also: ["tight coupling", "loosely coupled"]
      },
      {
        term: "over-engineering",
        meaning: "Building more complexity than the problem needs.",
        example: "Sharding at a thousand users is over-engineering \u2014 one database will carry us for two years.",
        avoid: "You are doing too much extra work unnecessarily."
      },
      {
        term: "the simplest thing that could work",
        meaning: "Arguing for the minimal viable design.",
        example: "What's the simplest thing that could work here? If a cron job and a table solve it, let's not add a queue.",
        note: "The most useful question in any design review."
      },
      {
        term: "fail gracefully",
        meaning: "Degrade in a controlled, useful way instead of crashing.",
        example: "If recommendations time out, we should fail gracefully and show the bestsellers rather than an error page.",
        also: ["degrade gracefully", "fall back to"]
      },
      {
        term: "source of truth",
        meaning: "The system that owns the canonical version of some data.",
        example: "If the CRM is the source of truth for contacts, our copy has to be read-only.",
        avoid: "Which one is the original data, that is the confusion."
      },
      {
        term: "idempotent",
        meaning: "Safe to run more than once with the same result.",
        example: "The webhook handler needs to be idempotent \u2014 the provider will retry, and we can't charge twice.",
        note: "Pronounced eye-DEM-po-tent. Essential in any payments or messaging discussion."
      },
      {
        term: "throw hardware at it",
        meaning: "Solve a performance problem by adding resources rather than fixing the code.",
        example: "We can throw hardware at it for now, but the query itself is the real problem.",
        also: ["scale vertically", "buy our way out"]
      },
      {
        term: "paint ourselves into a corner",
        meaning: "Make a choice that removes future options.",
        example: "If we expose internal IDs in the public API, we paint ourselves into a corner on any future migration.",
        also: ["a one-way door", "hard to reverse"]
      },
      {
        term: "technical debt",
        meaning: "Shortcuts taken now that cost extra effort later.",
        example: "We took on deliberate technical debt to hit the launch date, and the interest is now about a day a week.",
        note: "'Deliberate' debt is a decision; 'accidental' debt is a mistake. Distinguishing them changes the conversation."
      },
      {
        term: "the happy case is easy",
        meaning: "Pointing out that difficulty lies in failures, not the normal flow.",
        example: "The happy case is easy \u2014 the design question is what we do when the payment succeeds and the order write fails.",
        note: "Steers design reviews towards the places where systems actually break."
      },
      {
        term: "back-of-the-envelope",
        meaning: "A quick approximate calculation to sanity-check an idea.",
        example: "Back-of-the-envelope: ten thousand users, fifty events each, so half a million rows a day. Postgres handles that comfortably.",
        note: "Doing this out loud in a design review is enormously persuasive."
      },
      {
        term: "premature optimisation",
        meaning: "Making code faster before knowing whether speed is a problem.",
        example: "Caching here feels like premature optimisation \u2014 we haven't measured the endpoint yet.",
        also: ["optimising blind"]
      },
      {
        term: "swap out",
        meaning: "Replace one component with another.",
        example: "If we put an interface in front of it, we can swap out the storage layer later without touching the business logic.",
        also: ["replace", "substitute"]
      },
      {
        term: "lift and shift",
        meaning: "Move a system to new infrastructure without redesigning it.",
        example: "Phase one is a lift and shift to AWS; we'll re-architect once it's stable there.",
        avoid: "We will shift and lift. / We will just move as it is only."
      },
      {
        term: "the pragmatic choice",
        meaning: "The practical option, acknowledging it isn't the theoretically perfect one.",
        example: "Keeping the monolith is the pragmatic choice with four engineers \u2014 microservices would cost us more than they'd save.",
        note: "Lets you choose the boring option and sound deliberate rather than lazy."
      }
    ]
  },

  {
    id: "writing",
    name: "Email, Slack & Docs",
    icon: "mail",
    blurb: "Write messages people actually read and act on.",
    items: [
      {
        term: "Quick question \u2014",
        meaning: "An opener that tells the reader the message is short.",
        example: "Quick question \u2014 is the QA database refreshed from production, or is the data synthetic?",
        avoid: "Hi, hope you are doing well. I wanted to ask one thing if possible. Actually...",
        note: "Lead with the point. Pleasantries can come after, or not at all in Slack."
      },
      {
        term: "Action needed:",
        meaning: "A subject-line prefix stating that the reader must do something.",
        example: "Subject: Action needed: approve the vendor access request by Thursday",
        also: ["FYI only:", "Decision needed:"],
        note: "Labelling your subject line this way roughly doubles response rates. 'FYI only' also tells people they can relax."
      },
      {
        term: "as discussed",
        meaning: "Referring back to a conversation you both had.",
        example: "As discussed, I've raised the ticket for the index rebuild and assigned it to the platform team.",
        also: ["following up on our call", "per our conversation"],
        avoid: "As per discussed. / As we discussed on the same."
      },
      {
        term: "for visibility",
        meaning: "Sharing information without requesting action.",
        example: "Copying you for visibility \u2014 no action needed from your side.",
        also: ["keeping you in the loop", "just so you're aware"],
        note: "Kind phrase. It tells a busy person they can read and move on."
      },
      {
        term: "I'd suggest",
        meaning: "Proposing something with appropriate softness in writing.",
        example: "I'd suggest we agree the data contract before either team starts building.",
        also: ["it might be worth", "one option would be"],
        avoid: "You have to do this. / Kindly do this."
      },
      {
        term: "Could you confirm",
        meaning: "A clear, polite request for a definite answer.",
        example: "Could you confirm whether the certificate renewal is covered by your team or ours?",
        avoid: "Kindly confirm the same. / Please do the confirmation.",
        note: "'The same' as a pronoun ('please check the same') is regional business English. International readers find it odd \u2014 use 'it' or name the thing."
      },
      {
        term: "ahead of",
        meaning: "Before a specific event.",
        example: "Sharing the agenda ahead of Thursday's review so everyone can come prepared.",
        also: ["in advance of", "before"]
      },
      {
        term: "by end of day",
        meaning: "Before the working day finishes.",
        example: "I'll have the draft with you by end of day Wednesday, your time.",
        also: ["EOD", "by close of business"],
        note: "Always add the time zone with distributed teams. 'EOD' is ambiguous across continents."
      },
      {
        term: "no rush",
        meaning: "Explicitly removing time pressure.",
        example: "No rush on this \u2014 sometime next week is completely fine.",
        note: "If it isn't urgent, say so. Everything reads as urgent by default."
      },
      {
        term: "flagging early",
        meaning: "Raising a risk before it becomes a problem.",
        example: "Flagging early: the vendor hasn't confirmed sandbox access, which could push our integration by a week.",
        note: "Managers forgive delays they heard about in advance far more readily than surprises."
      },
      {
        term: "happy to jump on a call",
        meaning: "Offering a live conversation if writing isn't working.",
        example: "There's some nuance here \u2014 happy to jump on a call if that's easier than a long thread.",
        also: ["we could pick this up on a call"],
        note: "Use it after three round-trips on the same topic. That's the signal writing has failed."
      },
      {
        term: "thanks for the nudge",
        meaning: "Gracious response to a reminder you'd forgotten about.",
        example: "Thanks for the nudge \u2014 this dropped off my list. Looking at it now.",
        avoid: "Sorry sorry, I totally forgot it, my mistake.",
        note: "Acknowledge, don't grovel. One apology is enough; three undermines you."
      },
      {
        term: "TL;DR",
        meaning: "A summary at the top of a long message, for readers who won't read it all.",
        example: "TL;DR \u2014 the migration is safe to run, needs a thirty-minute window, and I'd like to do it Sunday.",
        also: ["Summary:", "In short:"],
        note: "Put it at the TOP, not the bottom. Written contexts only."
      },
      {
        term: "on my radar",
        meaning: "Something you're aware of but haven't started.",
        example: "The logging cleanup is on my radar for next sprint, not this one.",
        also: ["on my list"]
      },
      {
        term: "let me know if I've missed anything",
        meaning: "Closing a summary while inviting corrections.",
        example: "That's my understanding of the decisions from today \u2014 let me know if I've missed anything.",
        note: "Perfect sign-off for meeting notes. It makes your version the record unless someone objects."
      }
    ]
  },

  {
    id: "career",
    name: "Interviews, 1:1s & Feedback",
    icon: "star",
    blurb: "Talk about your own work and your own needs without shrinking.",
    items: [
      {
        term: "I led",
        meaning: "Claiming ownership of work you actually drove.",
        example: "I led the migration of our auth service, from the design document through to the production cutover.",
        avoid: "We did it. / It was done by our team.",
        note: "In interviews, 'we' hides you. Say 'the team did X; my part was Y'. Accurate and visible."
      },
      {
        term: "my contribution was",
        meaning: "Separating your work from the team's, honestly.",
        example: "The team rebuilt the checkout; my contribution was the pricing engine and the rollout plan.",
        note: "Credible because it's specific. Interviewers trust bounded claims more than sweeping ones."
      },
      {
        term: "the impact was",
        meaning: "Describing the result in numbers, not activity.",
        example: "The impact was a drop in p95 latency from 1.8 seconds to 400 milliseconds, and support tickets about timeouts stopped.",
        avoid: "I worked very hard on performance improvement.",
        note: "Always close a story with impact. Effort is invisible; outcomes are not."
      },
      {
        term: "in hindsight",
        meaning: "Reflecting honestly on what you'd do differently.",
        example: "In hindsight I'd have run a smaller pilot first \u2014 we learned the same lessons, just more expensively.",
        note: "Answers 'what would you do differently?' without sounding either defensive or self-destructive."
      },
      {
        term: "I'm keen to move into",
        meaning: "Stating an ambition clearly.",
        example: "I'm keen to move into more design-level work \u2014 owning a service end to end rather than discrete tickets.",
        also: ["I'd like to grow towards"],
        avoid: "If possible, maybe you can consider me for some bigger work."
      },
      {
        term: "what does good look like",
        meaning: "Asking for the concrete standard you're being measured against.",
        example: "What does good look like in this role after six months? I'd rather aim at something specific.",
        note: "Excellent in interviews and in 1:1s with a new manager. Almost nobody asks it."
      },
      {
        term: "I'd value your feedback on",
        meaning: "Requesting specific input rather than general praise.",
        example: "I'd value your feedback on how I handled the incident call \u2014 particularly how I communicated with the client.",
        avoid: "Please give me feedback. / How am I doing?",
        note: "Narrow requests get useful answers. Broad ones get 'you're doing great'."
      },
      {
        term: "that's fair, and here's what I'll change",
        meaning: "Accepting criticism and converting it to action.",
        example: "That's fair, and here's what I'll change: I'll post a written update before the standup rather than improvising.",
        note: "The highest-value response to criticism. Defensiveness costs more than the original mistake."
      },
      {
        term: "I'd push back on that",
        meaning: "Disagreeing with feedback, respectfully.",
        example: "I'd push back on that slightly \u2014 the delay came from the vendor, though I accept I should have escalated sooner.",
        note: "Concede the part that's true, contest the part that isn't. Never concede everything to end the conversation."
      },
      {
        term: "stretch myself",
        meaning: "Taking on work that is deliberately beyond your current level.",
        example: "I'd like to stretch myself on the platform work, even if it means being uncomfortable for a few months.",
        also: ["grow into", "step up"]
      },
      {
        term: "I don't know, but here's how I'd find out",
        meaning: "Handling a technical question you can't answer.",
        example: "I don't know how their consensus protocol handles network partitions, but here's how I'd find out and what I'd expect.",
        note: "Interviewers rate this far above a confident wrong answer. Bluffing is the real failure."
      },
      {
        term: "walk me through your reasoning",
        meaning: "Asking someone to show their thinking \u2014 useful when you interview others.",
        example: "Walk me through your reasoning on choosing a queue there \u2014 I'm more interested in the trade-offs than the answer.",
        also: ["talk me through how you got there"]
      },
      {
        term: "I'm at capacity",
        meaning: "Saying no to more work, clearly and without apology.",
        example: "I'm at capacity this sprint. I can take it next sprint, or we can move the reporting ticket off my plate.",
        avoid: "I will try to manage somehow.",
        note: "'I'll try to manage' sets you up to fail quietly. Offer a real alternative instead."
      },
      {
        term: "set me up to succeed",
        meaning: "Naming what you need in order to deliver.",
        example: "To set me up to succeed on this, I'd need access to the production logs and an hour a week with someone who knows the domain.",
        note: "Reframes asking for help as commitment to the outcome."
      },
      {
        term: "I'd like to be considered for",
        meaning: "Formally putting yourself forward.",
        example: "I'd like to be considered for the tech lead role when the team splits next quarter.",
        avoid: "Sir, please consider me if you are thinking of promoting someone.",
        note: "Say it once, plainly, to the person who decides. Hinting does not work."
      }
    ]
  },

  {
    id: "pitfalls",
    name: "Fix These Habits",
    icon: "pencil",
    blurb: "Phrases that sound normal at work but confuse international colleagues.",
    items: [
      {
        term: "I have a question",
        meaning: "Replaces 'I have a doubt'.",
        example: "I have a question about the deployment order.",
        avoid: "I have a doubt about the deployment order.",
        note: "'Doubt' = disbelief or suspicion in international English. 'I have a doubt about your design' sounds like you distrust it."
      },
      {
        term: "I'll get back to you",
        meaning: "Replaces 'I will revert back to you'.",
        example: "Let me check the logs and I'll get back to you within the hour.",
        avoid: "I will revert back to you.",
        note: "'Revert' means 'return to a previous state' \u2014 in code, undoing a commit. It never means 'reply'."
      },
      {
        term: "Could you please handle this",
        meaning: "Replaces 'Please do the needful'.",
        example: "Could you please approve the access request so the team can start on Monday?",
        avoid: "Please do the needful.",
        note: "'Do the needful' is unintelligible to most native speakers. State the actual action you want."
      },
      {
        term: "move it earlier / bring it forward",
        meaning: "Replaces 'prepone'.",
        example: "Can we bring the review forward to Tuesday?",
        avoid: "Can we prepone the review to Tuesday?",
        note: "'Prepone' isn't standard English, despite being a logical opposite of 'postpone'."
      },
      {
        term: "out of the office / travelling",
        meaning: "Replaces 'out of station'.",
        example: "I'm out of the office next week but contactable on Slack.",
        avoid: "I am out of station next week."
      },
      {
        term: "it / this",
        meaning: "Replaces 'the same' used as a pronoun.",
        example: "I've attached the report \u2014 please review it and let me know.",
        avoid: "Please find attached the report and revert on the same.",
        note: "'The same' as a standalone pronoun is regional business English. Use 'it', or name the thing."
      },
      {
        term: "ten million",
        meaning: "Replaces 'one crore' in international contexts.",
        example: "We're processing around ten million events a day.",
        avoid: "We are processing one crore events daily.",
        note: "Lakh and crore aren't understood outside South Asia. Convert: 1 lakh = 100,000; 1 crore = 10 million."
      },
      {
        term: "Sorry, could you repeat that?",
        meaning: "Replaces 'Come again?' or silently nodding.",
        example: "Sorry, could you repeat that? The audio cut out for a second.",
        avoid: "Come again? / Pardon?",
        note: "Blaming the connection is a graceful, universally accepted exit. Nodding when you didn't hear is the expensive option."
      },
      {
        term: "He has worked here for five years",
        meaning: "Present perfect for things still true \u2014 replaces 'He is working here since five years'.",
        example: "She has been with the platform team for three years.",
        avoid: "She is with the platform team since three years.",
        note: "English uses 'for' + duration and 'since' + a start point: 'for three years', 'since 2022'. Never 'since three years'."
      },
      {
        term: "Yesterday I deployed the fix",
        meaning: "Simple past for finished actions \u2014 replaces 'Yesterday I have deployed'.",
        example: "Yesterday I deployed the fix and this morning I verified the metrics.",
        avoid: "Yesterday I have deployed the fix.",
        note: "A stated past time ('yesterday', 'last week') requires the simple past, not the present perfect."
      },
      {
        term: "discuss the plan",
        meaning: "'Discuss' takes no preposition \u2014 replaces 'discuss about'.",
        example: "Let's discuss the rollout plan on Monday.",
        avoid: "Let's discuss about the rollout plan.",
        note: "Same family: 'request something' not 'request for', 'reach the office' not 'reach to'."
      },
      {
        term: "Could you explain it to me?",
        meaning: "Replaces 'Explain me'.",
        example: "Could you explain the retry logic to me?",
        avoid: "Can you explain me the retry logic?",
        note: "'Explain', 'describe' and 'suggest' need 'to me': explain it to me, suggest it to me."
      },
      {
        term: "equipment / software / feedback (uncountable)",
        meaning: "These words have no plural form.",
        example: "We need more equipment for the lab, and I've had useful feedback on the design.",
        avoid: "We need more equipments. / I got many feedbacks. / Give me some informations.",
        note: "Also uncountable: advice, research, staff, luggage, progress."
      },
      {
        term: "Thanks \u2014 that's helpful",
        meaning: "A natural thank-you \u2014 replaces over-formal gratitude.",
        example: "Thanks, that's really helpful. I'll take it from here.",
        avoid: "Thanking you in anticipation. / Thanks a lot for your kind cooperation and support.",
        note: "Modern workplace English is warm but brief. Elaborate formality reads as distant or sarcastic."
      },
      {
        term: "Hi Sarah / Hi team",
        meaning: "Standard professional greeting \u2014 replaces 'Respected Sir/Madam'.",
        example: "Hi Sarah \u2014 quick update on the migration.",
        avoid: "Respected Sir, / Dear Sir/Madam,",
        note: "Use first names with colleagues at every level in most Western companies. 'Dear Sir/Madam' is for formal letters to strangers."
      },
      {
        term: "around / about",
        meaning: "Replaces 'nearabout' and 'approximately only'.",
        example: "The job takes around forty minutes.",
        avoid: "It takes nearabout forty minutes only."
      },
      {
        term: "Let me know when you're free",
        meaning: "Replaces 'Tell me your free time' and 'When you are getting free?'.",
        example: "Let me know when you're free this week and I'll send an invite.",
        avoid: "When are you getting free? / Tell me your free timings."
      },
      {
        term: "I'm not sure \u2014 let me check",
        meaning: "Admitting uncertainty, which is normal and expected.",
        example: "I'm not sure that endpoint is still supported \u2014 let me check and confirm.",
        avoid: "Maybe yes, I think it should be working, actually I am not sure but...",
        note: "Native speakers say 'I don't know' freely. Hedging at length reads as less competent, not more polite."
      }
    ]
  }
];

/* ---- Longer model sentences for shadowing / reading practice ---- */
const DIALOGUES = [
  {
    id: "d-standup",
    deck: "standup",
    title: "A standup update that takes twenty seconds",
    lines: [
      { who: "You", text: "Yesterday I finished the retry logic for failed payments and it's in review." },
      { who: "You", text: "Today I'm picking up the reconciliation report." },
      { who: "You", text: "One blocker: I need read access to the finance database. Ravi, could you sort that out after this?" },
      { who: "Lead", text: "I'll get it done this morning." },
      { who: "You", text: "Perfect. Other than that, we're on track for Thursday." }
    ]
  },
  {
    id: "d-pushback",
    deck: "planning",
    title: "Pushing back on a new request",
    lines: [
      { who: "Manager", text: "Can you squeeze the analytics dashboard into this sprint?" },
      { who: "You", text: "I can, but I'd be honest with you \u2014 we're already at capacity." },
      { who: "You", text: "If it comes in, something has to come out. What would you like me to drop?" },
      { who: "Manager", text: "What are the options?" },
      { who: "You", text: "The logging cleanup is the cheapest to defer. The migration I'd keep, since it's on the critical path for next month." },
      { who: "Manager", text: "Let's drop the logging work then." },
      { who: "You", text: "Understood. I'll move it to next sprint and update the board so it's visible to everyone." }
    ]
  },
  {
    id: "d-incident",
    deck: "incident",
    title: "Reporting an outage to a non-technical stakeholder",
    lines: [
      { who: "Stakeholder", text: "Customers are saying checkout is broken. What's going on?" },
      { who: "You", text: "You're right, and I'm sorry \u2014 checkout has been degraded since about two o'clock." },
      { who: "You", text: "In plain terms, our payment provider is rejecting around one request in five, and our system isn't retrying them properly." },
      { who: "You", text: "What that means for customers is that some cards appear to fail when there's nothing wrong with the card." },
      { who: "Stakeholder", text: "How long until it's fixed?" },
      { who: "You", text: "We've already mitigated it by routing through the backup provider, so success rates are back to normal as of ten minutes ago." },
      { who: "You", text: "The permanent fix will go out tomorrow. I'll send a written summary this evening and a full post-mortem by Friday." }
    ]
  },
  {
    id: "d-review",
    deck: "review",
    title: "Disagreeing in a code review",
    lines: [
      { who: "Reviewer", text: "Why have you cached this in memory instead of using Redis?" },
      { who: "You", text: "Fair question. The dataset is about two hundred entries and it changes once a day, so in-memory felt proportionate." },
      { who: "Reviewer", text: "It won't be consistent across instances though." },
      { who: "You", text: "That's a good point, and I think it's acceptable here \u2014 a few minutes of drift doesn't affect the outcome." },
      { who: "You", text: "That said, you know this service better than I do, so I'm happy to be challenged. Would you call it blocking?" },
      { who: "Reviewer", text: "No, not blocking. Add a comment explaining the trade-off and I'll approve." },
      { who: "You", text: "Will do \u2014 I'll push that now." }
    ]
  },
  {
    id: "d-interview",
    deck: "career",
    title: "Answering 'tell me about a project you're proud of'",
    lines: [
      { who: "Interviewer", text: "Tell me about a project you're proud of." },
      { who: "You", text: "I led the replacement of our search infrastructure last year." },
      { who: "You", text: "The problem was that search took around four seconds and about a third of users abandoned the page before results loaded." },
      { who: "You", text: "The team was four engineers. My contribution was the indexing pipeline and the migration plan." },
      { who: "You", text: "We ran it alongside the old system for three weeks so we could compare results before cutting over." },
      { who: "You", text: "The impact was search dropping to under three hundred milliseconds, and abandonment falling from thirty-one percent to nine." },
      { who: "You", text: "In hindsight, I'd have started the dual-running sooner \u2014 we spent two weeks debating a decision the data answered in a day." }
    ]
  },
  {
    id: "d-clarify",
    deck: "meetings",
    title: "Rescuing a conversation you didn't follow",
    lines: [
      { who: "Colleague", text: "...so we'll denormalise it into the read model and let the projection handle the fan-out." },
      { who: "You", text: "Can I jump in? Just to make sure I've understood \u2014 you want to store a pre-joined copy of the data for reading?" },
      { who: "Colleague", text: "Exactly, yes." },
      { who: "You", text: "Got it. And when the source changes, something rebuilds that copy automatically?" },
      { who: "Colleague", text: "Right, that's the projection." },
      { who: "You", text: "That's clear now, thank you. My one question is how we handle a rebuild failure \u2014 do reads serve stale data or an error?" }
    ]
  }
];
