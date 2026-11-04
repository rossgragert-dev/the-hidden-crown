# Safe integration plan for the stacked pull requests

Status: **proposal only. Nothing in this document has been executed.** No stacked PR has been merged, retargeted, closed or deleted, and `main` is untouched. Every step below needs explicit approval.

## What is in the stack today

Verified with `git merge-base --is-ancestor` on a full (unshallow) clone:

```
main (479cdaa)
 └─ #1 development/v0.5.0-living-quests          +30 commits over main
     └─ #2 feature/squire-adventure              +39
         └─ #3 feature/claude-v061-visuals-joust  +9
             └─ #4 feature/v062-opening-height-geometry  +13
                 └─ #5 feature/v063-living-roads-magic  +23
                     └─ #6 feature/v064-pixel-art-rebuild  +11
                         └─ #7 feature/v065-dialogue-art-polish  +15
                             └─ #8 feature/v0651-armory-grounding  +9
                                 └─ #9 feature/v070-seven-chapter-squire  +34
                                     └─ review/comprehensive-game-audit  +1 (docs only)
                                         └─ development/v071-foundations-reforged  (this milestone)
                                             └─ development/v080-combat-reborn  (next milestone)
```

All of #1 to #9 are open drafts. **Every link is a strict ancestor of the next one**, so the whole stack is a single straight line and `main` can reach any tip by fast-forward. That makes the safest integration the simplest one.

## Why the order and the merge style matter

- If the PRs are merged one at a time with **squash** or **rebase** merges, every later branch still contains the original (un-squashed) commits and GitHub will report conflicts on each retarget. Avoid squash/rebase for this stack.
- `index.html` is a generated file committed next to its sources, so any textual conflict in it is meaningless. If a conflict ever appears, resolve `src/` and re-run `npm run build` instead of editing `index.html`.
- Old per-branch workflows each gate a different branch and none runs on `main`. The new `.github/workflows/ci.yml` runs on every push and every PR, so integration can be verified by one workflow.

## Recommended path (fewest moving parts)

Option A, a single fast-forward of `main` to a chosen tip. Preferred.

1. Pick the tip that should become `main` (for example `development/v071-foundations-reforged`, or the v0.8.0 tip once approved).
2. Wait for the `CI` workflow to be green on that tip (build, syntax check, full regression, 7-chapter golden path in portrait and landscape, campaign bot).
3. Take a safety tag first so nothing is lost: `git tag pre-integration-main main && git push origin pre-integration-main`.
4. Fast-forward only: `git checkout main && git merge --ff-only <tip> && git push origin main`. If the fast-forward is refused, stop and investigate; do not force-push.
5. GitHub marks each stacked PR whose head commits are now in `main` as merged. Check #1 to #9 individually; close any that GitHub did not mark merged with a comment pointing at the integration commit.
6. Delete branches only after that, and only after approval. Until then keep every branch (they are cheap and they preserve the review history).

Option B, merge PRs bottom-up with **merge commits** (not squash), keeping per-PR review.

1. Merge #1 into `main`. GitHub retargets #2 to `main` when #1's branch is deleted; if you do not want to delete branches, retarget #2 manually (`PATCH /repos/.../pulls/2 {"base":"main"}`).
2. Repeat for #2 through #9, waiting for CI after each.
3. Open the v0.7.1 and v0.8.0 PRs against `main` once their base commits are there.

Option B takes eleven merges but gives a review checkpoint per version. Option A gives the identical final tree in one step.

## Checks to run before either option

| Check | Command | Expected |
| --- | --- | --- |
| Build is committed | `npm run build && git diff --exit-code -- index.html` | no diff |
| Syntax | `npm run check` | both inline scripts parse, no optional chaining |
| Regression suite | `npm run test:ci` | all scripts pass |
| Golden path | `npm run test:golden` | 7 chapters in portrait and landscape through on-screen buttons |
| Campaign | `npm run test:bot` | all 21 missions progress |
| Saves | `node tests/save.js` | legacy, squire-era and current saves load; export/import round trip |
| Physical device | manual, iPhone Safari | not covered by any automated test; see the v0.7.1 report |

## Risks and how to back out

- **Save compatibility** is the main player-facing risk. v0.7.1 keeps the key `hiddencrown.save.v2` and only adds a `ver` field, so older builds still read newer saves (they ignore the extra field). See the save-compatibility report in `docs/V0_7_1_FOUNDATIONS_REFORGED.md`.
- **Back-out** for Option A: `git push origin pre-integration-main:main --force-with-lease` restores the old `main` (needs approval, because it rewrites `main`). For Option B: revert the individual merge commits.
- **Workflow retirement**: after integration, delete the nine old per-branch workflows in one commit. They are harmless until then and are deliberately left alone by this milestone.

## What I need from you

1. Which tip becomes `main` (v0.7.1 only, or after v0.8.0).
2. Option A or Option B.
3. Whether to delete the old branches afterwards or keep them.
