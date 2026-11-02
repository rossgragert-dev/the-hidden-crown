# v0.6.4 — Pixel Art Rebuild (First Scenic Fidelity Pass)

Development branch: `feature/v064-pixel-art-rebuild` (based on the v0.6.3 Living Roads work).

## Visual reference analysis
User-provided 20-second vertical video reviewed on November 1, 2026. The visible game sequences include broad valley views, multi-layer snow-covered mountain ridges, layered evergreen silhouettes, a winding rocky foreground, weather with dense atmospheric flakes and varying times of day. Even though the player sprite is small, the large landforms are composed coherently and read at screen scale. The new work deliberately adopts **compositional qualities**, NOT any existing footage or copyrighted sprites.

## What has changed
- New `src/49a_pixel_art.js` renders original 2D pixel-landscape layers, integrated with the existing story-aware environment module `src/49_world.js`.
- Each outdoor story scene and travel region now has a wider unique panorama for its biome and deterministic seed, rather than a single repeated distant castle, spire or same tiled field.
- Irregular mountain silhouettes have lit and shaded faces, rugged white snow shelves, narrow rocky gullies, and overlapping ridges. Forests have layered conifer outlines and distance haze. Outdoor terrain has smaller stones, grasses, and wetlands.
- Roads gain more region-appropriate foreground landmarks, including drawn farm cottages, raised bridges, carts, shrines, fences, and fallen logs, without a fixed repeated sequence of one wallpaper object.
- The hand-authored armory, stable and tournament visual modules from v0.6.1 remain in place. v0.6.3's defended drawbridge, fire scenery, Magister Ione tutorial, regional enemies, changing daylight and weather remain.
- Offscreen canvas caching is bounded at four scenic layers to reduce mobile render overhead. Cache doesn't duplicate every changing sky frame; sun/cloud motion continues at gameplay cadence.
- The old blocky snow-mountain foreground and heavily repeated farmroad/forest/road wallpaper code are bypassed for the converted biomes.
- Added `tests/pixel_art.js` with portrait and landscape scene differentiation, color variation, render-error checks and cache bounds.

## Limits / next graphics pass
- This pass specifically raises **outdoor environmental art**. The game remains pixelated 2D drawn at its original rendering resolution. It is not yet a full professional scene-art pipeline or a complete sprite redesign.
- Interior backgrounds, enemy animations, combat VFX, character expression, and individual mission-by-mission set dressing need more detailed art work.
- Close props still use procedural linework and shapes; hand-authored per-room pixel tiles and authored character sprite sheets would push quality further.
- iPhone Safari screenshots and performance benchmarks remain an owner's acceptance gate. Passing Chromium mobile regressions is not a substitute for actual device visual approval.

## Review
Play the frontier/mountain stage (M12), southern and Greenmarch road, foggy Veilfen (M4) and burning Hearthmoor (M10). Compare natural gameplay zoom, portrait and landscape. Confirm that the mountains no longer look like square blocks and the same distant castle does not repeatedly appear.
