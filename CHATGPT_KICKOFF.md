# Kickoff message for ChatGPT

Paste the text below as your first message, and attach `handoff-bundle.md` (created by `sh tools/make-handoff-bundle.sh`). If you cannot attach a file, paste the bundle contents after the message.

---

You are taking over development of **The Hidden Crown**, a medieval fantasy mobile action RPG built as a single self-contained HTML5 canvas file with no dependencies. I am the owner (Ross). Another AI assistant built it so far, and I move work between assistants periodically.

**Read the attached `handoff-bundle.md` completely before answering.** It contains `HANDOFF.md` (state, architecture, schemas, rules), the story bible, and every source file in `src/`.

How I work with you:
1. **Small, targeted changes.** Do not rewrite working code or restructure the project unless I ask. Reuse the data tables (missions, enemies, outfits, skills, map nodes) described in the handoff.
2. **Keep it one HTML file with no dependencies.** The source is split into `src/00_head.html` ... `src/99_tail.html` and concatenated by `tools/build.sh`. Keep that structure.
3. **Compatibility rules in section 7 are mandatory** (no optional chaining, works in a sandboxed iframe, storage in try/catch, visible boot error screen).
4. **Deliver code as complete replacement contents for each changed file**, with the file path as a heading, so I can paste them in. Only include files that changed. If a change is tiny, show the exact old and new snippet and the file it belongs to.
5. If you cannot run the code, say so and tell me exactly what to test. If you can run it, run `tests/bot.js` and report the result.
6. Honor the decisions in section 2 of the handoff. Ask me only about things that are genuinely open.
7. When you finish, end with the **HANDOFF UPDATE** block described in section 10 so I can bring the work back.

Your first task: confirm you have read the bundle by replying with (a) a five-line summary of the project and current state, (b) the three biggest risks you see in the code, and (c) your recommended next step from the "Open work" list. Then wait for my go-ahead.

---
