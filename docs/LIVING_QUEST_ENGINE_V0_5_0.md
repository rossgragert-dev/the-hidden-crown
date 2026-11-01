# The Hidden Crown — Living Quest Engine v0.5.0

Status: development prototype on `development/v0.5.0-living-quests`; not merged to `main`.

## Purpose
Replace the single-corridor main-quest structure with interconnected playable areas and varied objectives without rebuilding the engine or changing its pixel-art direction.

## Playable example
`m10` (Fire at Hearthmoor) now spans six consecutive areas:
1. Outer Fields: fight scouts and ring the alarm bell.
2. Gatehouse: defend the gate's health and secure its winch.
3. Burning Village: clear the street, choose the fate of villagers, recover provisions.
4. Chapel: clear blight enemies, activate a ward focus and keep the chapel ward alive.
5. Inner Keep: clear elite troops, confront Lord Garran and witness Halvard's injury.
6. Cellar Passage: open the exit, repel pursuit, obtain supplies and escape.

Each area changes background and enemy composition; objectives are tracked on the HUD. Main story flags and choices retain their original names for compatibility with M11 and later missions.

## Data format
Existing single-area missions continue to use `steps`. Multi-area missions instead use:

```js
{
  id:'m10', type:'main', /* ... */
  areas:[
    {id:'outskirts', title:'The Outer Fields', reg:'green', steps:[
      {t:'wave', goal:'Break through the scouts', list:[{k:'bandit',s:1,d:0}]},
      {t:'interact', goal:'Ring the alarm', name:'ALARM BELL',
       flag:'warned', lines:[N('The bell sounds.')]},
      {t:'defend', goal:'Keep the gate intact',target:'Gate',hp:145,
       list:[{k:'archer',s:1,d:0}]}
    ]}
  ]
}
```

- `goal` annotates each step that appears in the stage objective HUD.
- `interact` places a marker ahead of the player; move close and tap USE (or X).
- `defend` adapts waves with a damageable object; when its HP reaches zero, its encounter restarts.
- Completing the final step advances to the next area with a checkpoint; only the last area ends the mission.
- Areas automatically reuse existing palette keys (`REG`), enemy tables and save flags.
- Checkpoint shape is `G.checkpoint={id,area}`; stored in the existing `hiddencrown.save.v2` key, preserving old saves. Abandoning a mission leaves the last area checkpoint available to resume.
- For now, saved checkpoints resume at the start of an area with full HP/MP; rewards earned in prior areas are already stored in G but are not included in the resumed results tally.

## Test commands
```sh
npm install
npx playwright install chromium
npm run build
npm run test:smoke
npm run test:boot
npm run test:quest
npm run test:bot
```
The branch has a GitHub Actions workflow to perform these automatically. Tests must pass before merge. `tests/quest.js` covers area progression, interact objects, guard stages, completion and checkpoint resume.

## Caveats and next work
- This is one proof-of-concept quest. Do not replace all missions until real-device testing confirms the interface, pacing and objective clarity.
- Guarded objects use the existing combat AI and enemy archetypes; deeper tactical enemy behaviors, hazards, bosses with distinct phases, escorts, pathfinding and branching area routes remain future work.
- `m10` currently follows a fixed six-area route with one strategic village choice; optional areas and non-linear objective graphs are not yet implemented.
- The original mission bot uses combat shortcuts and is not a full human-paced traversal test.
- The six-area mission is **not** yet proven to last 25–35 minutes. Measure this on a phone before committing to pacing numbers.
- Keep the build output `index.html` in sync with `src/` using `sh tools/build.sh` on every release.

## Next planned phases
1. Playtest M10 on iPhone Safari (portrait, landscape, storage disabled and resumed game).
2. Improve defense feedback, objective affordances and checkpoint clarity.
3. Extend M7, M8, M11 and M12 using the same staged mission data.
4. Add object-based puzzles, escort NPC health/AI, environmental hazards and boss phases.
5. Rebalance main quest and dungeon runtime before beginning Act II.
