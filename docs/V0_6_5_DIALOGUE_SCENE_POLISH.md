# v0.6.5 — Dialogue and Scene Fidelity Repair

Based on the author's iPhone screenshots of The Hidden Crown v0.6.4.

**Branch:** `feature/v065-dialogue-art-polish` (from v0.6.4; not merged into main).

## Four reported problems and changes

1. **Choice options late; NPC already off-screen.** Mission steps previously placed choices at another invisible 270-pixel checkpoint, forcing the player to walk away from the conversation to make a decision. Choices immediately following a completed `say` or `wave` now trigger at the previous beat's completion. NPC speakers spawn 28 world units beside Corin instead of 90; the current camera/actor stay pinned for the choice. Where the previous wave contains a named humanoid boss, a wounded enemy figure is staged beside Corin rather than vanishing before the judgment screen. All choice flags, outcomes and gameplay progression are unchanged.

2. **Background flips to an old landscape at mission end.** The authored scene renderer now handles mode `done` in addition to `play`. When the rewards screen opens, the last real game canvas frame is captured and held behind the rewards modal, and is released when the player continues to the map or starts another mission. No generic fallback should appear during completion/results transitions.

3. **Large rectangular lump protruding from Corin's back.** This was the old, permanent shield slab from the generic `personParts` sword pose (seven pixels wide at x=-13), not a backpack. Corin now uses a slimmer off-hand/forearm in idle poses. His functional wooden/steel/reflecting shields still render when the GUARD control is held. Nonplayer shield-bearing characters retain their equipment.

4. **Foreground graphics are less detailed than backgrounds.** Ione's garden has a redesigned masonry/arched trellis with stone courses, vine clusters, flower beds and a glowing rune plinth instead of featureless barred rectangles. Stable stalls now include roof trusses, tack, hanging reins, grain textures, sunlight, bay shading and hay. Road wagons have arched canvas, wood joinery and detailed spoked wheels. Fences gain grain, joints and ground contact detail.

## Testing

A new `tests/polish.js` verifies the immediate "Spare him" moral choice following the Greenmarch guard dialogue, the speaker/camera location, completion-mode scenery and a frozen rewards backdrop, the no-lump sprite flags/geometry, and portrait/landscape screenshot capture of Ione's garden and the stables.

The GitHub workflow `.github/workflows/polish-v065.yml` runs the complete existing mobile browser regression suite alongside these checks. Physical Safari verification and final player visual approval are still necessary.

## Known scope

This is a targeted consistency and bug fix, not a total pixel-art redesign. Further hand-authored prop updates, character sprite refinement and environmental VFX can follow owner review. Existing missions, journey generation, weather, mounted jousting, save formats, and pixel-background layers are preserved.
